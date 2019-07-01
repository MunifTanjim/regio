import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal, FormGroup } from 'semantic-ui-react'
import { updateStudent } from 'store/actions/students.js'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    firstName: Yup.string().required(`required`),
    middleName: Yup.string(),
    lastName: Yup.string().required(`required`),
    dob: Yup.date().required(`required`)
  })
}

const getInitialValues = student => ({
  firstName: get(student, 'User.Person.firstName') || '',
  middleName: get(student, 'User.Person.middleName') || '',
  lastName: get(student, 'User.Person.lastName') || '',
  dob: get(student, 'User.Person.dob') || ''
})

function EditStudent({ StudentId, student, updateStudent }) {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(student), [student])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateStudent(StudentId, values)
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
    [StudentId, handleClose, updateStudent]
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
            trigger={<Button onClick={handleOpen}>Edit</Button>}
            closeIcon
            open={open}
            onClose={handleClose}
            as={Form}
            size="large"
          >
            <Header>Student: {StudentId}</Header>

            <Modal.Content>
              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <FormGroup widths="equal">
                <Input
                  id="firstName"
                  name="firstName"
                  label={`First Name`}
                  icon="user"
                />
                <Input
                  id="middleName"
                  name="middleName"
                  label={`Middle Name`}
                  icon="user"
                />
                <Input
                  id="lastName"
                  name="lastName"
                  label={`Last Name`}
                  icon="user"
                />
              </FormGroup>

              <Input
                id="dob"
                name="dob"
                type="date"
                label={`Date of Birth`}
                icon="calendar alternate"
                min="1900-01-01"
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

const mapStateToProps = ({ students }, { StudentId }) => ({
  student: get(students.items.byId, StudentId)
})

const mapDispatchToProps = {
  updateStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStudent)
