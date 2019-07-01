import Form from 'components/Form/Form.js'
import FormInput from 'components/Form/Input'
import FormSelect from 'components/Form/Select'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get, map, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  FormField,
  FormGroup,
  Message,
  Segment,
  Table
} from 'semantic-ui-react'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import {
  getAllFeedbackStatements,
  getStudentFeedbacks,
  getTermCourseTeachers,
  submitStudentFeedback
} from 'store/actions/terms.js'
import getPersonName from 'utils/get-person-name'
import * as Yup from 'yup'

const getValidationSchema = (teacherIds, statements) => {
  return Yup.object({
    TeacherId: Yup.number()
      .integer()
      .required(`required`),
    byId: Yup.object(
      map(statements, 'id').reduce((byId, id) => {
        byId[id] = Yup.object({
          comment: Yup.string(),
          rate: Yup.number()
            .integer()
            .min(-2)
            .max(2)
        })
        return byId
      }, {})
    )
  })
}

const getInitialValues = (teacherIds, statements) => ({
  TeacherId: get(teacherIds, 0, ''),
  byId: map(statements, 'id').reduce((byId, id) => {
    byId[id] = { comment: '', rate: 0 }
    return byId
  }, {})
})

function StudentFeedbackGive({
  TermId,
  CourseId,
  termcourses,
  getTermCourseTeachers,
  studentfeedbacks,
  getStudentFeedbacks,
  getAllFeedbackStatements,
  teachers,
  fetchAllTeachersPage,
  submitStudentFeedback,
  navigate
}) {
  useEffect(() => {
    fetchAllTeachersPage()
  }, [fetchAllTeachersPage])

  useEffect(() => {
    getStudentFeedbacks(TermId, CourseId)
    getAllFeedbackStatements(TermId, CourseId)
    getTermCourseTeachers(TermId, { query: `filter=CourseId==${CourseId}` })
  }, [
    CourseId,
    TermId,
    getTermCourseTeachers,
    getAllFeedbackStatements,
    getStudentFeedbacks
  ])

  const statements = useMemo(() => {
    return studentfeedbacks.statementItems.allIds
      .sort((a, b) => a - b)
      .map(id => get(studentfeedbacks.statementItems.byId, id))
  }, [
    studentfeedbacks.statementItems.allIds,
    studentfeedbacks.statementItems.byId
  ])

  const teacherIds = useMemo(() => {
    return Object.keys(
      get(termcourses.sectionsByTeacherId, `${TermId}_${CourseId}`, {})
    )
  }, [CourseId, TermId, termcourses.sectionsByTeacherId])

  const teacherOptions = useMemo(() => {
    return zipObject(
      teacherIds,
      map(teacherIds, id =>
        getPersonName(get(teachers.items.byId, [id, 'User', 'Person']))
      )
    )
  }, [teacherIds, teachers.items.byId])

  const initialValues = useMemo(
    () => getInitialValues(teacherIds, statements),
    [statements, teacherIds]
  )
  const validationSchema = useMemo(
    () => getValidationSchema(teacherIds, statements),
    [statements, teacherIds]
  )

  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await submitStudentFeedback(TermId, CourseId, values)
        actions.setSubmitting(false)
        navigate('..')
      } catch (err) {
        actions.setSubmitting(false)

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
    },
    [CourseId, TermId, navigate, submitStudentFeedback]
  )

  return (
    <Permit student>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Segment as={Form}>
            <FormSelect
              name="TeacherId"
              label={`Teacher`}
              options={teacherOptions}
            />

            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>No.</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Statement</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.keys(values.byId).map(id => (
                  <Table.Row key={id}>
                    <Table.Cell collapsing textAlign="right">
                      {id}
                    </Table.Cell>
                    <Table.Cell collapsing>
                      {get(studentfeedbacks.statementItems.byId, [
                        id,
                        'statement'
                      ])}
                    </Table.Cell>
                    <Table.Cell>
                      {get(studentfeedbacks.statementItems.byId, [
                        id,
                        'toRate'
                      ]) ? (
                        <FormInput
                          type="range"
                          name={`byId.${id}.rate`}
                          min={-2}
                          max={2}
                        />
                      ) : (
                        get(studentfeedbacks.statementItems.byId, [
                          id,
                          'toComment'
                        ]) && <FormInput name={`byId.${id}.comment`} />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Message color="yellow" hidden={!status}>
              {status}
            </Message>

            <FormGroup widths="equal">
              <FormField>
                <Button type="reset" fluid>
                  Reset
                </Button>
              </FormField>
              <FormField>
                <Button
                  fluid
                  positive
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                >
                  Save
                </Button>
              </FormField>
            </FormGroup>
          </Segment>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = (
  { teachers, termcourses, studentfeedbacks },
  { TermId, CourseId }
) => ({
  teachers,
  termcourse: get(termcourses.items.byId, `${TermId}_${CourseId}`),
  termcourses,
  studentfeedbacks
})

const mapDispatchToProps = {
  fetchAllTeachersPage,
  getTermCourseTeachers,
  getStudentFeedbacks,
  getAllFeedbackStatements,
  submitStudentFeedback
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentFeedbackGive)
