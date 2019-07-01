import { Form, Formik } from 'formik'
import { get, isNull, mapValues, memoize } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Table } from 'semantic-ui-react'
import { updateSessionalMarks } from 'store/actions/teachers.js'
import * as Yup from 'yup'
import MarkRow from './MarkRow'

class YupNumber extends Yup.number {
  _typeCheck(value) {
    return value === '' || (super._typeCheck && super._typeCheck(value))
  }

  cast(value, options) {
    if (value === '') return undefined
    return super.cast(value, options)
  }

  required(message) {
    const result = this.test({
      message,
      name: 'requiredYupNumber',
      test: value => (value === '' ? false : true)
    })
    return result
  }
}

const getSessionalMarkSchema = memoize(maxMarks => {
  return Yup.object({
    attendance: new YupNumber()
      .min(0, `minimum 0`)
      .max(maxMarks.attendance, `maximum ${maxMarks.attendance}`)
      .notRequired(),
    performanceAndReports: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(
        maxMarks.performanceAndReports,
        `maximum mark is ${maxMarks.performanceAndReports}`
      )
      .notRequired(),
    finalQuiz: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(maxMarks.finalQuiz, `maximum mark is ${maxMarks.finalQuiz}`)
      .notRequired(),
    finalViva: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(maxMarks.finalViva, `maximum mark is ${maxMarks.finalViva}`)
      .notRequired()
  })
})

function TeacherCourseMarksSessionalEditForm({
  TeacherId,
  TermId,
  CourseId,
  course,
  markIdsByStudent,
  sessionalMarks,
  updateSessionalMarks
}) {
  const initialValues = useMemo(() => {
    return Object.entries(markIdsByStudent).reduce(
      (values, [StudentId, markId]) => {
        values[StudentId] = mapValues(
          {
            attendance: get(
              sessionalMarks.items.byId,
              [markId, 'attendance'],
              null
            ),
            performanceAndReports: get(
              sessionalMarks.items.byId,
              [markId, 'performanceAndReports'],
              null
            ),
            finalQuiz: get(
              sessionalMarks.items.byId,
              [markId, 'finalQuiz'],
              null
            ),
            finalViva: get(
              sessionalMarks.items.byId,
              [markId, 'finalViva'],
              null
            )
          },
          v => (isNull(v) ? '' : v)
        )
        return values
      },
      {}
    )
  }, [markIdsByStudent, sessionalMarks])

  const maxMarks = useMemo(() => {
    const creditHr = Number(get(course, 'creditHr'))
    const maxMarks = {
      attendance: creditHr * 10,
      performanceAndReports: creditHr * 60,
      finalQuiz: creditHr * 15,
      finalViva: creditHr * 15
    }
    return maxMarks
  }, [course])

  const validationSchema = useMemo(() => {
    return Yup.object(
      Object.keys(markIdsByStudent).reduce((objectShape, StudentId) => {
        objectShape[StudentId] = getSessionalMarkSchema(maxMarks)
        return objectShape
      }, {})
    )
  }, [maxMarks, markIdsByStudent])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, actions) => {
        actions.setStatus(null)

        try {
          await updateSessionalMarks(TeacherId, TermId, CourseId, {
            marksByStudentId: values
          })
        } catch (err) {
          if (err.errors) {
            actions.setStatus(
              err.errors
                .map(({ param, message }) => `${param}: ${message}`)
                .join(', ')
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
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Attendance
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Performance & Reports
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Final Quiz
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Final Viva
                </Table.HeaderCell>
                <Table.HeaderCell collapsing />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.keys(values).map(key => (
                <MarkRow
                  key={key}
                  TermId={TermId}
                  CourseId={CourseId}
                  StudentId={key}
                  initialValue={initialValues[key]}
                  setFieldValue={setFieldValue}
                  maxMarks={maxMarks}
                />
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell>
                  {status ? <Message color="yellow">{status}</Message> : null}
                </Table.HeaderCell>
                <Table.HeaderCell colSpan="3">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                    fluid
                    positive
                  >
                    Save
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Footer>
          </Table>
        </Form>
      )}
    </Formik>
  )
}

const mapStateToProps = ({ courses, marks }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId),
  sessionalMarks: marks.sessional
})

const mapDispatchToProps = {
  updateSessionalMarks
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksSessionalEditForm)
