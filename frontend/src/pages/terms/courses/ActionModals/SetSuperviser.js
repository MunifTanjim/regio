import Form from 'components/Form/Form.js'
import Select from 'components/Form/Select.js'
import Permit from 'components/Permit.js'
import { Formik } from 'formik'
import useModal from 'hooks/useModal.js'
import { get, map, zipObject } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Modal } from 'semantic-ui-react'
import { setResearchSuperviser } from 'store/actions/terms.js'
import getPersonName from 'utils/get-person-name'
import * as Yup from 'yup'

function SetSuperviser({
  TermId,
  CourseId,
  StudentId,
  TeacherId,
  teachers,
  setResearchSuperviser
}) {
  const [open, { handleOpen, handleClose }] = useModal(false)

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      StudentId: Yup.number()
        .integer()
        .required(`required`),
      TeacherId: Yup.number()
        .integer()
        .required(`required`)
    })
  }, [])

  const teacherOptions = useMemo(() => {
    return zipObject(
      teachers.items.allIds,
      map(teachers.items.allIds, id =>
        getPersonName(get(teachers.items.byId, [id, 'User', 'Person']))
      )
    )
  }, [teachers.items])

  return (
    <Permit sysadmin>
      <Formik
        initialValues={{
          StudentId,
          TeacherId: String(TeacherId || teachers.items.allIds[0] || '')
        }}
        enableReinitialize
        isInitialValid={true}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          actions.setStatus(null)

          try {
            await setResearchSuperviser(TermId, CourseId, values)
            actions.setSubmitting(false)
            handleClose()
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
        {({ isSubmitting, isValid, status }) => (
          <Modal
            trigger={<Button onClick={handleOpen}>Set</Button>}
            closeIcon
            open={open}
            onClose={handleClose}
            as={Form}
            size="large"
          >
            <Header>Set Superviser for {StudentId}</Header>

            <Modal.Content>
              {status ? <Message color="yellow">{status}</Message> : null}

              <Select
                id="TeacherId"
                name="TeacherId"
                label={`Teacher`}
                options={teacherOptions}
                search
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

const mapStateToProps = (
  { courses, students, teachers },
  { CourseId, StudentId }
) => ({
  course: get(courses.items.byId, CourseId),
  student: get(students.items.byId, StudentId),
  teachers: teachers
})

const mapDispatchToProps = {
  setResearchSuperviser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetSuperviser)
