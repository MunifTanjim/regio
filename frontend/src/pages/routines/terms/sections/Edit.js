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
import {
  getAllRoutinesForTerm,
  getAllSlots,
  setRoutinesForTermSection
} from 'store/actions/routines.js'
import { getBatch } from 'store/actions/batches.js'
import { getCoursesForTerm, getTermCourses } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU']
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
const breakLetterByDays = ['B', 'R', 'E', 'A', 'K']
const reservedSlotIds = [1, 4, 8]

const dayOptions = formatDropdownOptions(zipObject(days, dayNames))

const initialRoutinePlacerState = {
  day: null,
  slotId: null,
  CourseId: null,
  error: null
}

function routinePlacerReducer(state, { type, value }) {
  switch (type) {
    case 'DAY':
      return { ...state, day: value }
    case 'SLOTID':
      return { ...state, slotId: value }
    case 'COURSEID':
      return { ...state, CourseId: value }
    case 'ERROR':
      return { ...state, error: value }
    default:
      throw new Error(`invalid type: ${type}`)
  }
}
function _RoutinePlacer({
  formik: { values, setFieldValue },
  courseIds,
  courses,
  slotItems,
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

  const slotOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        slotItems.allIds,
        map(slotItems.allIds, id => {
          const start = get(slotItems.byId, [id, 'startTime'], '').slice(0, -3)
          const end = get(slotItems.byId, [id, 'endTime'], '').slice(0, -3)
          return `${start}—${end}`
        })
      )
    )
  }, [slotItems.allIds, slotItems.byId])

  const onSubmit = useCallback(() => {
    const existing = get(values, [state.day, state.slotId])

    if (existing) {
      dispatch({ type: 'SLOTID', value: null })
      dispatch({ type: 'ERROR', value: `already exists` })
      setTimeout(() => dispatch({ type: 'ERROR', value: null }), 2000)
      return
    }

    setFieldValue(`${state.day}.${state.slotId}`, state.CourseId)
    dispatch({ type: 'SLOTID', value: null })
    dispatch({ type: 'COURSEID', value: null })
  }, [dispatch, setFieldValue, state, values])

  const disabled =
    !state.day ||
    !state.slotId ||
    !state.CourseId ||
    reservedSlotIds.includes(Number(state.slotId))

  return (
    <>
      <HeaderGrid
        Left={
          <FormGroup>
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
              <label>Select Slot</label>
              <Dropdown
                selection
                search
                value={state.slotId}
                options={slotOptions}
                onChange={(_, { value }) => {
                  dispatch({ type: 'SLOTID', value })
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
                  dispatch({ type: 'COURSEID', value })
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
            <Button type="button" disabled={disabled} onClick={onSubmit}>
              Place Class
            </Button>
          </FormField>
        }
      />
    </>
  )
}

const RoutinePlacer = connectFormik(_RoutinePlacer)

function RoutineTermSectionsEdit({
  TermId,
  section,
  routines,
  getAllRoutinesForTerm,
  getAllSlots,
  termcourses,
  getTermCourses,
  courses,
  getCoursesForTerm,
  setRoutinesForTermSection,
  term,
  batch,
  getBatch
}) {
  useEffect(() => {
    if (get(term, 'BatchId') && !batch) getBatch(get(term, 'BatchId'))
  }, [batch, getBatch, term])

  useEffect(() => {
    getAllSlots({ query: `sort=startTime` })
  }, [getAllSlots])

  useEffect(() => {
    getAllRoutinesForTerm(TermId, { query: `filter=section==${section}` })
  }, [TermId, getAllRoutinesForTerm, section])

  const routineStub = useMemo(() => {
    const dayStub = zipObject(
      routines.slotItems.allIds,
      routines.slotItems.allIds.map(() => null)
    )
    const stub = zipObject(days, days.map(() => dayStub))
    return stub
  }, [routines.slotItems.allIds])

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
    const routineIds = get(routines.items.groupedIdsByTerm, TermId, []).filter(
      id => regex.test(id)
    )

    const data = {}
    const items = routineIds.map(id => get(routines.items.byId, id))
    const byDay = groupBy(items, 'day')

    for (const [day, dayItems] of Object.entries(byDay)) {
      data[day] = dayItems.reduce((dayData, item) => {
        item.RoutineSlotIds.forEach(slotId => {
          dayData[slotId] = item.CourseId
        })
        return dayData
      }, {})
    }

    return defaultsDeep(data, routineStub)
  }, [
    TermId,
    routineStub,
    routines.items.byId,
    routines.items.groupedIdsByTerm,
    section
  ])

  const [placerState, placerDispatch] = useReducer(
    routinePlacerReducer,
    initialRoutinePlacerState
  )

  const getClassData = useCallback(
    (values, day, slotId) => {
      const classData = {
        disabled: reservedSlotIds.includes(slotId),
        text: ''
      }

      if (classData.disabled) {
        classData.text =
          slotId === 1 ? 'CT' : breakLetterByDays[days.indexOf(day)]
      } else {
        classData.text = get(courses.items.byId, [
          get(values, [day, slotId]),
          'code'
        ])
      }

      return classData
    },
    [courses.items.byId]
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
            await setRoutinesForTermSection({
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
                Left={<Header>Edit Routine for Section {section}</Header>}
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
                  {routines.slotItems.allIds.map(slotId => (
                    <Table.HeaderCell key={slotId}>
                      {get(
                        routines.slotItems.byId,
                        [slotId, 'startTime'],
                        ''
                      ).slice(0, -3)}
                      <br />
                      &mdash;
                      <br />
                      {get(
                        routines.slotItems.byId,
                        [slotId, 'endTime'],
                        ''
                      ).slice(0, -3)}
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
                    {routines.slotItems.allIds.map(slotId => {
                      const { disabled, text } = getClassData(
                        values,
                        day,
                        slotId
                      )

                      return (
                        <Table.Cell
                          key={`${day}-${slotId}`}
                          collapsing
                          selectable
                          disabled={disabled}
                          className={disabled ? 'static' : ''}
                          onClick={() => {
                            if (disabled || get(values, [day, slotId])) return

                            placerDispatch({ type: 'DAY', value: day })
                            placerDispatch({
                              type: 'SLOTID',
                              value: String(slotId)
                            })
                          }}
                        >
                          {!disabled && get(values, [day, slotId]) && (
                            <Icon
                              link
                              name="close"
                              size="mini"
                              color="red"
                              onClick={() => {
                                setFieldValue(`${day}.${slotId}`, null)
                              }}
                            />
                          )}
                          {text}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Segment>
              <RoutinePlacer
                courseIds={courseIds}
                courses={courses}
                slotItems={routines.slotItems}
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
  getAllRoutinesForTerm,
  getAllSlots,
  getCoursesForTerm,
  getTermCourses,
  setRoutinesForTermSection,
  getBatch
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineTermSectionsEdit)
