import useModal from 'hooks/useModal.js'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { deleteContactInfo } from 'store/actions/users.js'

function Delete({ UserId, data, deleteContactInfo, isCurrent }) {
  const [open, { handleOpen, handleClose }] = useModal(false)

  const [status, setStatus] = useState(null)

  const handleConfirm = useCallback(async () => {
    setStatus(null)
    try {
      await deleteContactInfo(UserId, data.id, isCurrent)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [UserId, data.id, deleteContactInfo, isCurrent])

  return (
    <>
      <Button onClick={handleOpen}>Delete</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        header={`Delete contact information (${data.type.join(', ')})?`}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            {status ? <Message color="yellow">{status}</Message> : null}
          </ModalContent>
        }
        confirmButton="Delete"
      />
    </>
  )
}

const mapStateToProps = (
  { user, students, teachers },
  { entityType, entityId }
) => {
  const entity =
    entityType === 'teacher'
      ? get(teachers.items.byId, entityId)
      : entityType === 'student'
      ? get(students.items.byId, entityId)
      : get(user, 'data')

  return {
    isCurrent: entityType === 'current',
    UserId: get(entity, 'User.id')
  }
}

const mapDispatchToProps = {
  deleteContactInfo
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Delete)
