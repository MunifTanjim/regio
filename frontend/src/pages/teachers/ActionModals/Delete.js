import Permit from 'components/Permit.js'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { deleteUser } from 'store/actions/users.js'

function Delete({ data, deleteUser }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await deleteUser(data.User.id)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [deleteUser, data.User.id])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Delete</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            {status ? <Message color="yellow">{status}</Message> : null}
          </ModalContent>
        }
        header={`Delete ${data.id}?`}
        confirmButton="Delete"
      />
    </Permit>
  )
}

const mapDispatchToProps = {
  deleteUser
}

export default connect(
  null,
  mapDispatchToProps
)(Delete)
