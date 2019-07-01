import { Form, Formik } from 'formik'
import { get, isNull } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Message, Table } from 'semantic-ui-react'
import { updateClassTestMarks } from 'store/actions/teachers.js'
import * as Yup from 'yup'
import MarkRow from './MarkRow'

const ctMarkSchema = Yup.number()
  .min(0, `minimum 0`)
  .max(20, `maximum 20`)
  .notRequired()

function ClassTestMarksForm({
  TeacherId,
  TermId,
  CourseId,
  StudentIds,
  ctNumbers,
  ctNumber,
  classTestMarks,
  updateClassTestMarks
}) {
  const initialValues = useMemo(() => {
    return StudentIds.reduce(
      (values, StudentId) => {
        const value = get(
          classTestMarks.items.byId,
          [`${TermId}_${CourseId}_${StudentId}_${ctNumber}`, 'mark'],
          null
        )
        values[StudentId] = isNull(value) ? '' : Number(value)
        return values
      },
      { number: ctNumber }
    )
  }, [StudentIds, ctNumber, classTestMarks.items.byId, TermId, CourseId])

  const validationSchema = useMemo(() => {
    const maxCtNumber = ctNumbers.length
    return Yup.object(
      StudentIds.reduce(
        (objectShape, StudentId) => {
          objectShape[StudentId] = ctMarkSchema
          return objectShape
        },
        {
          number: Yup.number()
            .min(1, 'minimum 1')
            .max(maxCtNumber, `maximum ${maxCtNumber}`)
        }
      )
    )
  }, [StudentIds, ctNumbers])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async ({ number, ...values }, actions) => {
        actions.setStatus(null)

        try {
          await updateClassTestMarks(TeacherId, TermId, CourseId, {
            number,
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
                  Obtained Mark
                </Table.HeaderCell>
                <Table.HeaderCell collapsing textAlign="center">
                  Total Mark
                </Table.HeaderCell>
                <Table.HeaderCell collapsing />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.keys(values).map(key => (
                <MarkRow
                  key={key}
                  StudentId={key}
                  value={values[key]}
                  setFieldValue={setFieldValue}
                />
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell>
                  {status ? <Message color="yellow">{status}</Message> : null}
                </Table.HeaderCell>
                <Table.HeaderCell colSpan="2">
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

const mapStateToProps = ({ marks }) => ({
  classTestMarks: marks.classtest
})

const mapDispatchToProps = {
  updateClassTestMarks
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassTestMarksForm)
