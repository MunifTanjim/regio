import Form from 'components/Form/Form'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { connect as connectFormik, Formik } from 'formik'
import { defaultsDeep, get, groupBy, map, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dropdown,
  FormField,
  FormGroup,
  Header,
  Icon,
  Label,
  Message,
  Segment,
  Table
} from 'semantic-ui-react'
import { getBatch } from 'store/actions/batches.js'
import {
  getAllWeekPlansForTerm,
  setWeekPlanForTermSection
} from 'store/actions/routines.js'
import { getCoursesForTerm, getTermCourses } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU']
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
const weekNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

const dayOptions = formatDropdownOptions(zipObject(days, dayNames))

const initialRoutinePlacerState = {
  weekNumber: null,
  day: null,
  note: null,
  error: null
}

function placerReducer(state, { type, value }) {
  switch (type) {
    case 'DAY':
      return { ...state, day: value }
    case 'WEEKNUMBER':
      return { ...state, weekNumber: value }
    case 'NOTE':
      return { ...state, note: value }
    case 'ERROR':
      return { ...state, error: value }
    default:
      throw new Error(`invalid type: ${type}`)
  }
}
function _Placer({
  formik: { setFieldValue },
  courseIds,
  courses,
  state,
  dispatch
}) {
  const courseOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        courseIds,
        map(courseIds, id => get(courses.items.byId, [id, 'code']))
      )
    )
  }, [courseIds, courses.items.byId])

  const weekNumberOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        weekNumbers,
        map(weekNumbers, weekNumber => {
          return String(weekNumber).padStart(2, '0')
        })
      )
    )
  }, [])

  const onSubmit = useCallback(() => {
    setFieldValue(
      `${state.day}.${state.weekNumber}`,
      get(courses.items.byId, [state.note, 'code'])
    )
    dispatch({ type: 'DAY', value: null })
  }, [
    courses.items.byId,
    dispatch,
    setFieldValue,
    state.day,
    state.note,
    state.weekNumber
  ])

  return (
    <>
      <HeaderGrid
        Left={
          <FormGroup>
            <FormField>
              <label>Select Week</label>
              <Dropdown
                selection
                search
                value={state.weekNumber}
                options={weekNumberOptions}
                onChange={(_, { value }) => {
                  dispatch({ type: 'WEEKNUMBER', value })
                }}
              />
            </FormField>
            <FormField>
              <label>Select Day</label>
              <Dropdown
                selection
                search
                value={state.day}
                options={dayOptions}
                onChange={(_, { value }) => {
                  dispatch({ type: 'DAY', value })
                }}
              />
            </FormField>
            <FormField>
              <label>Select Course</label>
              <Dropdown
                selection
                search
                value={state.CourseId}
                options={courseOptions}
                onChange={(_, { value }) => {
                  dispatch({ type: 'NOTE', value })
                }}
              />
            </FormField>
          </FormGroup>
        }
        Right={
          <FormField inline>
            {state.error && (
              <Label basic color="red" pointing="right">
                {state.error}
              </Label>
            )}
            <Button type="button" onClick={onSubmit}>
              Place Plan
            </Button>
          </FormField>
        }
      />
    </>
  )
}

const Placer = connectFormik(_Placer)

function WeekPlanTermSectionsEdit({
  TermId,
  section,
  routines,
  getAllWeekPlansForTerm,
  setWeekPlanForTermSection,
  termcourses,
  getTermCourses,
  courses,
  getCoursesForTerm,
  term,
  batch,
  getBatch
}) {
  useEffect(() => {
    if (get(term, 'BatchId') && !batch) getBatch(get(term, 'BatchId'))
  }, [batch, getBatch, term])

  useEffect(() => {
    getAllWeekPlansForTerm(TermId, { query: `filter=section==${section}` })
  }, [TermId, getAllWeekPlansForTerm, section])

  const weekPlanStub = useMemo(() => {
    const dayStub = zipObject(weekNumbers, map(weekNumbers, () => ''))
    return zipObject(days, map(days, () => dayStub))
  }, [])

  useEffect(() => {
    getTermCourses(TermId)
    getCoursesForTerm(TermId)
  }, [TermId, getCoursesForTerm, getTermCourses])

  const termcourseIds = useMemo(() => {
    return get(termcourses.items.groupedIdsByTerm, TermId, [])
  }, [TermId, termcourses])

  const courseIds = useMemo(() => {
    return map(termcourseIds, id =>
      get(termcourses.items.byId, [id, 'CourseId'], null)
    )
  }, [termcourseIds, termcourses.items.byId])

  const initialValues = useMemo(() => {
    const regex = RegExp(`^${TermId}_${section}_`)
    const weekPlanIds = get(
      routines.weekPlanItems.groupedIdsByTerm,
      TermId,
      []
    ).filter(id => regex.test(id))

    const data = {}
    const items = weekPlanIds.map(id => get(routines.weekPlanItems.byId, id))
    const byDay = groupBy(items, 'day')

    for (const [day, dayItems] of Object.entries(byDay)) {
      data[day] = dayItems.reduce((dayData, item) => {
        dayData[item.weekNumber] = item.note
        return dayData
      }, {})
    }

    return defaultsDeep(data, weekPlanStub)
  }, [
    TermId,
    routines.weekPlanItems.byId,
    routines.weekPlanItems.groupedIdsByTerm,
    section,
    weekPlanStub
  ])

  const [placerState, placerDispatch] = useReducer(
    placerReducer,
    initialRoutinePlacerState
  )

  return (
    <Permit sysadmin UserId={`T${get(batch, 'coordinatorId')}`}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        isInitialValid
        onSubmit={async (values, actions) => {
          actions.setStatus(null)

          try {
            await setWeekPlanForTermSection({
              TermId,
              section,
              ...values
            })
          } catch (err) {
            if (err.errors) {
              err.errors.forEach(({ param, message }) =>
                actions.setFieldError(param, message)
              )
            } else if (err.message) {
              actions.setStatus(err.message)
            } else {
              actions.setStatus(null)
              console.error(err)
            }
          }

          actions.setSubmitting(false)
        }}
      >
        {({ isSubmitting, isValid, values, status, setFieldValue }) => (
          <Form>
            <Segment>
              <HeaderGrid
                Left={<Header>Edit CT Schedule for Section {section}</Header>}
                Right={
                  <>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </>
                }
              />
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>
            </Segment>

            <Table celled textAlign="center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing />
                  {weekNumbers.map(weekNumber => (
                    <Table.HeaderCell key={weekNumber} collapsing>
                      {String(weekNumber).padStart(2, '0')}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {days.map(day => (
                  <Table.Row key={day}>
                    <Table.Cell collapsing>
                      <strong>{day}</strong>
                    </Table.Cell>
                    {weekNumbers.map(weekNumber => {
                      const note = get(values, [day, weekNumber])
                      return (
                        <Table.Cell
                          key={`${day}-${weekNumber}`}
                          collapsing
                          selectable
                          onClick={() => {
                            placerDispatch({ type: 'DAY', value: day })
                            placerDispatch({
                              type: 'WEEKNUMBER',
                              value: String(weekNumber)
                            })
                          }}
                        >
                          {get(values, [day, weekNumber]) && (
                            <Icon
                              link
                              name="close"
                              size="mini"
                              color="red"
                              onClick={() => {
                                setFieldValue(`${day}.${weekNumber}`, '')
                              }}
                            />
                          )}
                          {note}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Segment>
              <Placer
                courseIds={courseIds}
                courses={courses}
                state={placerState}
                dispatch={placerDispatch}
              />
            </Segment>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = (
  { batches, courses, routines, terms, termcourses },
  { TermId }
) => ({
  courses,
  routines,
  termcourses,
  term: get(terms.items.byId, TermId),
  batch: get(batches.items.byId, get(terms.items.byId, [TermId, 'BatchId']))
})

const mapDispatchToProps = {
  getAllWeekPlansForTerm,
  setWeekPlanForTermSection,
  getCoursesForTerm,
  getTermCourses,
  getBatch
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeekPlanTermSectionsEdit)
