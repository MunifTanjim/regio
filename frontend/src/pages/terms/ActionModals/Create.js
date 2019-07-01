import Form from 'components/Form/Form.js'
import Select from 'components/Form/Select.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import useModal from 'hooks/useModal.js'
import { last, zipObject } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Header, Message, Modal } from 'semantic-ui-react'
import { createTerm } from 'store/actions/terms.js'
import * as Yup from 'yup'

const validLevels = ['1', '2', '3', '4']
const validTerms = ['1', '2']

const levelOptions = zipObject(validLevels, validLevels)
const termOptions = zipObject(validTerms, validLevels)

const getValidationSchema = () =>
  Yup.object().shape({
    SessionYearId: Yup.string()
      .matches(/^\d{4}-\d{4}$/)
      .test('is-valid-range', 'invalid range', sessionyear => {
        const [start, end] = sessionyear.split('-').map(Number)
        return end === start + 1
      })
      .required(`required`),
    BatchId: Yup.number()
      .integer()
      .required(`required`),
    level: Yup.string().oneOf(validLevels),
    term: Yup.string().oneOf(validTerms)
  })

const getInitialValues = (sessionyearIds, batches) => ({
  SessionYearId: last(sessionyearIds),
  BatchId: last(batches.items.allIds),
  level: validLevels[0],
  term: validTerms[0]
})

function Create({ batches, sessionyearIds, createTerm }) {
  const [open, { handleOpen, handleClose }] = useModal(false)

  const sessionyearOptions = useMemo(
    () => zipObject(sessionyearIds, sessionyearIds),
    [sessionyearIds]
  )

  const batchOptions = useMemo(
    () => zipObject(batches.items.allIds, batches.items.allIds),
    [batches.items.allIds]
  )

  const initialValues = useMemo(
    () => getInitialValues(sessionyearIds, batches),
    [batches, sessionyearIds]
  )
  const validationSchema = useMemo(() => getValidationSchema(), [])

  return (
    <Permit sysadmin>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        isInitialValid
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          actions.setStatus(null)

          try {
            await createTerm(values)
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
        }}
      >
        {({ isSubmitting, isValid, values, status }) => (
          <Modal
            trigger={<Button onClick={handleOpen}>Create</Button>}
            closeIcon
            open={open}
            onClose={handleClose}
            as={Form}
            size="large"
          >
            <Header>New Term</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormGroup widths="equal">
                <Select
                  id="SessionYearId"
                  name="SessionYearId"
                  label={`Session`}
                  options={sessionyearOptions}
                  search
                />

                <Select
                  name="BatchId"
                  label={`Batch`}
                  options={batchOptions}
                  search
                />

                <Select
                  id="level"
                  name="level"
                  label={`Level`}
                  options={levelOptions}
                  search
                />

                <Select
                  id="term"
                  name="term"
                  label={`Term`}
                  options={termOptions}
                  search
                />
              </FormGroup>
            </Modal.Content>
            <Modal.Actions>
              <Button type="reset">Reset</Button>
              <Button
                positive
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </Permit>
  )
}

const mapStateToProps = ({ batches, courses, sessionyears }) => ({
  batches,
  courses: courses.items,
  sessionyearIds: sessionyears.items.allIds
})

const mapDispatchToProps = {
  createTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create)
