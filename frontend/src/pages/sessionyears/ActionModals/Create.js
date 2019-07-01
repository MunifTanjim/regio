import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal } from 'semantic-ui-react'
import { createSessionYear } from 'store/actions/sessionyears.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    id: Yup.string()
      .matches(/^\d{4}-\d{4}$/)
      .test('is-valid-range', 'invalid range', sessionyear => {
        const [start, end] = sessionyear.split('-').map(Number)
        return end === start + 1
      })
      .required(`required`)
  })
}

function Create({ createSessionYear }) {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => ({ id: '' }), [])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createSessionYear(values)
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
    [createSessionYear, handleClose]
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
            <Header>New Session</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <Input id="id" name="id" label={`Session`} />
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
  createSessionYear
}

export default connect(
  null,
  mapDispatchToProps
)(Create)
