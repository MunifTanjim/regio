import Permit from 'components/Permit.js'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { deleteCourse } from 'store/actions/courses.js'

function Delete({ data, deleteCourse }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await deleteCourse(data.id)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [data.id, deleteCourse])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Delete</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        header={`Delete ${data.code}?`}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            {status ? <Message color="yellow">{status}</Message> : null}
          </ModalContent>
        }
        confirmButton="Delete"
      />
    </Permit>
  )
}

const mapDispatchToProps = {
  deleteCourse
}

export default connect(
  null,
  mapDispatchToProps
)(Delete)
