import { Form, Formik } from 'formik';
import { get, isNull, mapValues, memoize } from 'lodash-es';
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { Button, Message, Table } from 'semantic-ui-react';
import { updateResearchMarks } from 'store/actions/teachers.js';
import * as Yup from 'yup';
import MarkRow from './MarkRow';






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

const getResearchMarkSchema = memoize(maxMarks => {
  return Yup.object({
    viva: new YupNumber()
      .min(0, `minimum 0`)
      .max(maxMarks.viva, `maximum ${maxMarks.viva}`)
      .notRequired(),
    external: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(maxMarks.external, `maximum mark is ${maxMarks.external}`)
      .notRequired(),
    internal: new YupNumber()
      .min(0, `minimum mark is 0`)
      .max(maxMarks.internal, `maximum mark is ${maxMarks.internal}`)
      .notRequired()
  })
})

function TeacherCourseMarksResearchEditForm({
  TeacherId,
  TermId,
  CourseId,
  course,
  markIdsByStudent,
  researchMarks,
  updateResearchMarks
}) {
  const initialValues = useMemo(() => {
    return Object.entries(markIdsByStudent).reduce(
      (values, [StudentId, markId]) => {
        values[StudentId] = mapValues(
          {
            viva: get(researchMarks.items.byId, [markId, 'viva'], null),
            external: get(researchMarks.items.byId, [markId, 'external'], null),
            internal: get(researchMarks.items.byId, [markId, 'internal'], null)
          },
          v => (isNull(v) ? '' : v)
        )
        return values
      },
      {}
    )
  }, [markIdsByStudent, researchMarks])

  const maxMarks = useMemo(() => {
    const creditHr = Number(get(course, 'creditHr'))
    const maxMarks = {
      viva: creditHr * 30,
      external: creditHr * 20,
      internal: creditHr * 50
    }
    return maxMarks
  }, [course])

  const validationSchema = useMemo(() => {
    return Yup.object(
      Object.keys(markIdsByStudent).reduce((objectShape, StudentId) => {
        objectShape[StudentId] = getResearchMarkSchema(maxMarks)
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
          await updateResearchMarks(TeacherId, TermId, CourseId, {
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
                  Viva
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  External Examiner
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Superviser
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
  researchMarks: marks.research
})

const mapDispatchToProps = {
  updateResearchMarks
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksResearchEditForm)
