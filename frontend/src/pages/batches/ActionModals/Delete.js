import Permit from 'components/Permit'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { deleteBatch } from 'store/actions/batches.js'

function Delete({ data, deleteBatch }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await deleteBatch(data.id)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [data.id, deleteBatch])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Delete</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        header={`Delete Batch ${data.id}?`}
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
  deleteBatch
}

export default connect(
  null,
  mapDispatchToProps
)(Delete)
