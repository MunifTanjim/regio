import { Form, Formik } from 'formik'
import { get, isNull, mapValues, memoize } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Table } from 'semantic-ui-react'
import { updateTheoryMarks } from 'store/actions/teachers.js'
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

const getTheoryMarkSchema = memoize(maxMarks => {
  return Yup.object({
    attendance: new YupNumber()
      .min(0, `minimum 0`)
      .max(maxMarks.attendance, `maximum ${maxMarks.attendance}`)
      .notRequired(),
    classTests: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(maxMarks.classTests, `maximum mark is ${maxMarks.classTests}`)
      .notRequired(),
    finalExamSectionA: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(
        maxMarks.finalExamSectionA,
        `maximum mark is ${maxMarks.finalExamSectionA}`
      )
      .notRequired(),
    finalExamSectionB: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(
        maxMarks.finalExamSectionB,
        `maximum mark is ${maxMarks.finalExamSectionB}`
      )
      .notRequired()
  })
})

function TeacherCourseMarksTheoryEditForm({
  TeacherId,
  TermId,
  CourseId,
  course,
  theoryMarkIdsByStudent,
  theoryMarks,
  updateTheoryMarks
}) {
  const initialValues = useMemo(() => {
    return Object.entries(theoryMarkIdsByStudent).reduce(
      (values, [StudentId, markId]) => {
        values[StudentId] = mapValues(
          {
            attendance: get(
              theoryMarks.items.byId,
              [markId, 'attendance'],
              null
            ),
            classTests: get(
              theoryMarks.items.byId,
              [markId, 'classTests'],
              null
            ),
            finalExamSectionA: get(
              theoryMarks.items.byId,
              [markId, 'finalExamSectionA'],
              null
            ),
            finalExamSectionB: get(
              theoryMarks.items.byId,
              [markId, 'finalExamSectionB'],
              null
            )
          },
          v => (isNull(v) ? '' : v)
        )
        return values
      },
      {}
    )
  }, [theoryMarkIdsByStudent, theoryMarks])

  const maxMarks = useMemo(() => {
    const creditHr = Number(get(course, 'creditHr'))
    const maxMarks = {
      attendance: creditHr * 10,
      classTests: creditHr * 20,
      finalExamSectionA: creditHr * 35,
      finalExamSectionB: creditHr * 35
    }
    return maxMarks
  }, [course])

  const validationSchema = useMemo(() => {
    return Yup.object(
      Object.keys(theoryMarkIdsByStudent).reduce((objectShape, StudentId) => {
        objectShape[StudentId] = getTheoryMarkSchema(maxMarks)
        return objectShape
      }, {})
    )
  }, [maxMarks, theoryMarkIdsByStudent])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, actions) => {
        actions.setStatus(null)

        try {
          await updateTheoryMarks(TeacherId, TermId, CourseId, {
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
                  Class Tests
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Final Exam (Sec. A)
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Final Exam (Sec. B)
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
  theoryMarks: marks.theory
})

const mapDispatchToProps = {
  updateTheoryMarks
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksTheoryEditForm)
