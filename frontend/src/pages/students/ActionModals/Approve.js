import Permit from 'components/Permit.js'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { approveStudent } from 'store/actions/students.js'

function Approve({ data, approveStudent }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await approveStudent(data.id)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [approveStudent, data.id])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Approve</Button>
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
        header={`Approve ${data.id}?`}
        confirmButton="Approve"
      />
    </Permit>
  )
}

const mapDispatchToProps = {
  approveStudent
}

export default connect(
  null,
  mapDispatchToProps
)(Approve)
