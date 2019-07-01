import Form from 'components/Form/Form.js'
import FormSelect from 'components/Form/Select'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import { get, map, zipObject } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal } from 'semantic-ui-react'
import { updateBatch } from 'store/actions/batches.js'
import getPersonName from 'utils/get-person-name'
import * as Yup from 'yup'

const getValidationSchema = () =>
  Yup.object().shape({
    coordinatorId: Yup.number()
      .integer()
      .required(`required`)
  })

const getInitialValues = data => ({
  coordinatorId: String(get(data, 'coordinatorId') || '')
})

function Create({ BatchId, data, teachers, updateBatch }) {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const initialValues = useMemo(() => getInitialValues(data), [data])
  const validationSchema = useMemo(() => getValidationSchema(data), [data])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateBatch(BatchId, values)
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
    [BatchId, handleClose, updateBatch]
  )

  const coordinatorOptions = useMemo(() => {
    return zipObject(
      teachers.items.allIds,
      map(teachers.items.allIds, id =>
        getPersonName(get(teachers.items.byId, [id, 'User', 'Person']))
      )
    )
  }, [teachers.items.allIds, teachers.items.byId])

  return (
    <Permit sysadmin>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={<Button onClick={handleOpen}>Edit</Button>}
            closeIcon
            open={open}
            onClose={handleClose}
            as={Form}
            size="large"
          >
            <Header>Edit Batch: {get(data, 'id')}</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormSelect
                name="coordinatorId"
                label={`Co-ordinator`}
                options={coordinatorOptions}
              />
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

const mapStateToProps = ({ teachers }) => ({
  teachers
})

const mapDispatchToProps = {
  updateBatch
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create)
