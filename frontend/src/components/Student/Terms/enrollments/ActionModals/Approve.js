import Permit from 'components/Permit.js'
import useModal from 'hooks/useModal.js'
import { map } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { approveTermEnrollments } from 'store/actions/students.js'

function StudentTermEnrollmentApprove({
  StudentId,
  TermId,
  courses,
  needApproval,
  approveTermEnrollments
}) {
  const [open, { handleOpen, handleClose }] = useModal()
  const [status, setStatus] = useState(null)

  const handleConfirm = useCallback(async () => {
    setStatus(null)

    try {
      await approveTermEnrollments(StudentId, TermId)
      handleClose()
    } catch (err) {
      const errorMessages = []

      if (err.errors) {
        err.errors.forEach(({ param, message }) =>
          message.push(`${param}: ${message}`)
        )
      } else if (err.message) {
        errorMessages.push(`${err.message}`)
      } else {
        console.error(err)
      }

      setStatus(errorMessages.join(', ') || null)
    }
  }, [StudentId, TermId, approveTermEnrollments, handleClose])

  return needApproval ? (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Approve</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        content={
          <ModalContent>
            <p>{map(courses, 'code').join(', ')}</p>
            {status ? <Message color="yellow">{status}</Message> : null}
          </ModalContent>
        }
        header={`Approve Enrollment for ${courses.length} Courses?`}
        confirmButton="Approve"
      />
    </Permit>
  ) : null
}

const mapStateToProps = ({ courses }, { enrollments }) => {
  const CourseIds = map(enrollments, 'CourseId')

  const _courses = map(CourseIds, id => courses.items.byId[id])

  const needApproval = map(enrollments, 'approved').some(approved => !approved)

  return {
    courses: _courses,
    needApproval
  }
}

const mapDispatchToProps = {
  approveTermEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentTermEnrollmentApprove)
