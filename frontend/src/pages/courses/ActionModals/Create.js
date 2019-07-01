import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Select from 'components/Form/Select.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import useModal from 'hooks/useModal.js'
import { zipObject } from 'lodash-es'
import React, { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Header, Message, Modal } from 'semantic-ui-react'
import { createCourse } from 'store/actions/courses.js'
import * as Yup from 'yup'

const validTypes = ['theory', 'sessional', 'supervised']

const typeOptions = zipObject(validTypes, validTypes.map(v => v.toUpperCase()))

const getValidationSchema = () =>
  Yup.object().shape({
    code: Yup.string()
      .matches(/^\w+ \d+$/)
      .required(`required`),
    title: Yup.string().required(`required`),
    creditHr: Yup.number()
      .positive()
      .required(`required`),
    type: Yup.string().oneOf(validTypes)
  })

const getInitialValues = () => ({
  code: '',
  title: '',
  creditHr: '',
  type: validTypes[0]
})

function Create({ createCourse }) {
  const [open, { handleOpen, handleClose }] = useModal(false)

  const initialValues = useMemo(() => getInitialValues(), [])
  const validationSchema = useMemo(() => getValidationSchema(), [])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await createCourse(values)
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
    [createCourse]
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
            <Header>New Course</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormGroup widths="equal">
                <Input id="code" name="code" label={`Code`} />

                <Input id="title" name="title" label={`Title`} />

                <Input
                  id="creditHr"
                  name="creditHr"
                  label={`Credit-Hour`}
                  type="number"
                  step=".25"
                />

                <Select
                  id="type"
                  name="type"
                  label={`Type`}
                  options={typeOptions}
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

const mapDispatchToProps = {
  createCourse
}

export default connect(
  null,
  mapDispatchToProps
)(Create)
