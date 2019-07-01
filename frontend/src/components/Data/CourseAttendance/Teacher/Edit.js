import Form from 'components/Form/Form.js'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { FieldArray, Formik } from 'formik'
import { get, map, zipObject } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Message,
  Segment,
  Table
} from 'semantic-ui-react'
import { takeAttendance, updateAttendance } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import * as Yup from 'yup'

const emptyArray = []

function TeacherCourseAttendanceEdit({
  TeacherId,
  TermId,
  CourseId,
  attendances,
  enrollments,
  todayDate,
  takeAttendance,
  updateAttendance,
  navigate,
  sections = emptyArray
}) {
  const [section, setSection] = useState()

  useEffect(() => {
    setSection(sections[0])
  }, [sections])

  const StudentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    const enrollmentIds = enrollments.items.allIds
      .filter(id => regex.test(id))
      .filter(id => get(enrollments.items.byId, [id, 'type']) !== 'short')
      .filter(id => get(enrollments.items.byId, [id, 'section']) === section)

    return enrollmentIds
      .map(id => get(enrollments.items.byId, [id, 'StudentId']))
      .sort()
  }, [
    TermId,
    CourseId,
    enrollments.items.allIds,
    enrollments.items.byId,
    section
  ])

  const dates = useMemo(() => {
    if (todayDate) return [todayDate]

    const regex = RegExp(`^${TermId}_${CourseId}_.+_${section}$`)

    return map(
      attendances.items.allIds
        .filter(id => regex.test(id))
        .map(id => get(attendances.items.byId, id)),
      'date'
    ).reverse()
  }, [
    CourseId,
    TermId,
    attendances.items.allIds,
    attendances.items.byId,
    section,
    todayDate
  ])

  const dateOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(dates, dates))
  }, [dates])

  const sectionOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(sections, sections))
  }, [sections])

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      TermId: Yup.number()
        .integer()
        .required(`required`),
      CourseId: Yup.number()
        .integer()
        .required(`required`),
      date: Yup.string()
        .oneOf(dates, `invalid date`)
        .required(`required`),
      section: Yup.string()
        .oneOf(sections, `invalid section`)
        .required(`required`),
      StudentIds: Yup.array().required(`required`)
    })
  }, [dates, sections])

  const [date, setDate] = useState(todayDate)

  const initialValues = useMemo(() => {
    const values = {
      TermId,
      CourseId,
      date,
      section,
      StudentIds: []
    }

    if (!date) return values

    const presentIds = get(
      attendances.items.byId,
      [`${TermId}_${CourseId}_${date}_${section}`, 'StudentIds'],
      []
    )

    values.StudentIds = StudentIds.map(StudentId =>
      presentIds.includes(StudentId) ? StudentId : null
    )

    return values
  }, [TermId, CourseId, date, attendances.items.byId, section, StudentIds])

  return (
    <Permit UserId={`T${TeacherId}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (
          { TermId, CourseId, date, section, StudentIds },
          actions
        ) => {
          actions.setStatus(null)

          try {
            if (todayDate) {
              await takeAttendance(TermId, CourseId, {
                date,
                section,
                StudentIds: StudentIds.filter(Boolean)
              })

              navigate('..')
            } else {
              await updateAttendance(TermId, CourseId, date, {
                section,
                StudentIds: StudentIds.filter(Boolean)
              })
            }
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
                Left={
                  <Header>
                    {todayDate ? 'Take' : 'Edit'} Attendance [Section {section}
                    ]:{' '}
                    {date
                      ? DateTime.fromISO(date).toFormat('dd LLL, yyyy')
                      : null}
                  </Header>
                }
                Right={
                  <>
                    <Dropdown
                      selection
                      compact
                      value={section}
                      options={sectionOptions}
                      onChange={(_, { value }) => {
                        setSection(value)
                      }}
                    />
                    {!todayDate && (
                      <Dropdown
                        selection
                        search
                        value={date}
                        options={dateOptions}
                        onChange={(_, { value }) => {
                          setDate(value)
                        }}
                      />
                    )}
                  </>
                }
              />
            </Segment>

            {status ? <Message color="yellow">{status}</Message> : null}

            <Table selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell collapsing>
                    {todayDate && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (values.StudentIds.some(id => id))
                            setFieldValue(
                              'StudentIds',
                              StudentIds.map(() => null)
                            )
                          else setFieldValue('StudentIds', StudentIds)
                        }}
                      >
                        Toggle All
                      </Button>
                    )}
                    <Button type="reset" disabled={!date}>
                      Reset
                    </Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!date || !isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {date && (
                <Table.Body>
                  <FieldArray name="StudentIds">
                    {arrayHelpers => {
                      return StudentIds.map((id, i) => {
                        const isPresent = Boolean(values.StudentIds[i])

                        return (
                          <Table.Row
                            key={id}
                            positive={isPresent}
                            negative={!isPresent}
                            onClick={() => {
                              if (values.StudentIds[i])
                                arrayHelpers.replace(i, null)
                              else arrayHelpers.replace(i, id)
                            }}
                          >
                            <Table.Cell>{id}</Table.Cell>
                            <Table.Cell collapsing>
                              {isPresent ? (
                                <>
                                  <Icon name="checkmark" /> Present
                                </>
                              ) : (
                                <>
                                  <Icon name="close" /> Absent
                                </>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        )
                      })
                    }}
                  </FieldArray>
                </Table.Body>
              )}

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell collapsing>
                    <Button type="reset" disabled={!date}>
                      Reset
                    </Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!date || !isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Form>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = (
  { attendances, enrollments, termcourses },
  { TermId, CourseId, TeacherId }
) => ({
  attendances,
  enrollments,
  sections: get(termcourses.sectionsByTeacherId, [
    `${TermId}_${CourseId}`,
    TeacherId
  ])
})

const mapDispatchToProps = {
  takeAttendance,
  updateAttendance
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseAttendanceEdit)
