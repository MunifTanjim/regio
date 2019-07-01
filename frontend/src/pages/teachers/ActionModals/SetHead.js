import Permit from 'components/Permit.js'
import { get, map } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import { setTeacherAsHead } from 'store/actions/teachers.js'
import getPersonName from 'utils/get-person-name'

function SetHead({ data, setTeacherAsHead }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await setTeacherAsHead(data.id)
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [data.id, setTeacherAsHead])

  const isAlreadyHead = useMemo(() => {
    return map(get(data, 'User.Roles'), 'id').includes('head')
  }, [data])

  return isAlreadyHead ? null : (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Set Head</Button>
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
        header={`Set ${getPersonName(get(data, 'User.Person'))} as Head?`}
        confirmButton="Set as Head"
      />
    </Permit>
  )
}

const mapDispatchToProps = {
  setTeacherAsHead
}

export default connect(
  null,
  mapDispatchToProps
)(SetHead)
