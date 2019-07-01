import Permit from 'components/Permit.js'
import React, { useCallback, useState } from 'react'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import api from 'utils/api.js'

function ResetPassword({ UserId }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)
  const [newPassword, setNewPassword] = useState(null)

  const handleOpen = useCallback(() => {
    setNewPassword(null)
    setOpen(true)
  }, [])
  const handleClose = useCallback(() => {
    setNewPassword(null)
    setOpen(false)
  }, [])

  const handleConfirm = useCallback(async () => {
    try {
      setNewPassword(null)
      setStatus(null)

      const { data, error } = await api(
        `/users/${UserId}/action/reset-password`,
        { method: 'POST' }
      )

      if (error) throw error

      setNewPassword(data.password)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [UserId])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Reset Password</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        content={
          <ModalContent>
            <p>Are you sure?</p>
            {status ? <Message color="yellow">{status}</Message> : null}
            {newPassword ? (
              <Message color="green">
                New Password: <strong>{newPassword}</strong>
              </Message>
            ) : null}
          </ModalContent>
        }
        header={`Reset Password for ${UserId}?`}
        confirmButton="Reset"
      />
    </Permit>
  )
}

export default ResetPassword
