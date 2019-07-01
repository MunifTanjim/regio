import Permit from 'components/Permit.js'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { deleteSessionYear } from 'store/actions/sessionyears.js'

function Delete({ data, deleteSessionYear }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await deleteSessionYear(data.id)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [data.id, deleteSessionYear])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Delete</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        header={`Delete Session ${data.id}?`}
        content={
          <ModalContent>
            <p>Are you sure?</p>

            <Message color="yellow" hidden={!status}>
              {status}
            </Message>
          </ModalContent>
        }
        confirmButton="Delete"
      />
    </Permit>
  )
}

const mapDispatchToProps = {
  deleteSessionYear
}

export default connect(
  null,
  mapDispatchToProps
)(Delete)
