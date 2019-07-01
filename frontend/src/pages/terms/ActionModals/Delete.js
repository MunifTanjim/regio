import { navigate } from '@reach/router'
import useModal from 'hooks/useModal.js'
import { get } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Confirm, Message, ModalContent } from 'semantic-ui-react'
import Permit from '../../../components/Permit.js'
import { deleteTerm } from '../../../store/actions/terms.js'

function Delete({ TermId, term, deleteTerm }) {
  const [open, { handleOpen, handleClose }] = useModal(false)

  const [status, setStatus] = useState(null)

  const handleConfirm = useCallback(async () => {
    try {
      setStatus(null)
      await deleteTerm(TermId)
      navigate('/terms')
    } catch (err) {
      if (err.message) setStatus(err.message)
      else console.error(err)
    }
  }, [TermId, deleteTerm])

  return (
    <Permit sysadmin>
      <Button onClick={handleOpen}>Delete</Button>
      <Confirm
        open={open}
        onCancel={handleClose}
        onConfirm={handleConfirm}
        header={`Delete Term ${get(term, 'level')}-${get(term, 'term')} (${get(
          term,
          'SessionYearId'
        )})?`}
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

const mapStateToProps = ({ terms }, { TermId }) => ({
  term: get(terms.items.byId, TermId)
})

const mapDispatchToProps = {
  deleteTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Delete)
