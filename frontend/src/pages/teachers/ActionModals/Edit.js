import Form from 'components/Form/Form.js'
import Input from 'components/Form/Input.js'
import Select from 'components/Form/Select.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, FormGroup, Header, Message, Modal } from 'semantic-ui-react'
import { updateTeacher } from 'store/actions/teachers.js'
import * as Yup from 'yup'

const teacherRanks = {
  lecturer: `Lecturer`,
  'assistant-professor': `Assistant Professor`,
  'associate-professor': `Associate Professor`,
  professor: `Professor`
}

const teacherRankIds = Object.keys(teacherRanks)

const getValidationSchema = () => {
  return Yup.object({
    firstName: Yup.string().required(`required`),
    middleName: Yup.string(),
    lastName: Yup.string().required(`required`),
    dob: Yup.date().required(`required`),
    rank: Yup.string()
      .oneOf(teacherRankIds)
      .required(`required`)
  })
}

const getInitialValues = teacher => ({
  firstName: get(teacher, 'User.Person.firstName') || '',
  middleName: get(teacher, 'User.Person.middleName') || '',
  lastName: get(teacher, 'User.Person.lastName') || '',
  dob: get(teacher, 'User.Person.dob') || '',
  rank: get(teacher, 'rank') || ''
})

function EditTeacher({ TeacherId, teacher, updateTeacher }) {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const validationSchema = useMemo(() => getValidationSchema(), [])
  const initialValues = useMemo(() => getInitialValues(teacher), [teacher])
  const onSubmit = useCallback(
    async (values, actions) => {
      actions.setStatus(null)

      try {
        await updateTeacher(TeacherId, values)
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
    [TeacherId, handleClose, updateTeacher]
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
            <Header>Teacher: T{TeacherId}</Header>

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

              <Select
                id="rank"
                name="rank"
                label={`Academic Rank`}
                options={teacherRanks}
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

const mapStateToProps = ({ teachers }, { TeacherId }) => ({
  teacher: get(teachers.items.byId, TeacherId)
})

const mapDispatchToProps = {
  updateTeacher
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeacher)
