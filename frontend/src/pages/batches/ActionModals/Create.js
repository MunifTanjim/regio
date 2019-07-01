import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal } from 'semantic-ui-react'
import { createBatch } from 'store/actions/batches.js'
import * as Yup from 'yup'

const getValidationSchema = () =>
  Yup.object().shape({
    BatchId: Yup.number()
      .min(2012, 'batch starts from 2012')
      .required(`required`)
  })

const getInitialValues = () => ({
  BatchId: ''
})

function Create({ createBatch }) {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createBatch(values)
        actions.resetForm()
        handleClose()
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
    },
    [createBatch, handleClose]
  )

  return (
    <Permit sysadmin>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={<Button onClick={handleOpen}>Create</Button>}
            closeIcon
            open={open}
            onClose={handleClose}
            as={Form}
            size="large"
          >
            <Header>New Batch</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <Input id="BatchId" name="BatchId" label={`Batch`} />
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

const mapDispatchToProps = {
  createBatch
}

export default connect(
  null,
  mapDispatchToProps
)(Create)
