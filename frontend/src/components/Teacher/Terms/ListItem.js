import { Link } from '@reach/router'
import TermHeader from 'components/Data/TermHeader'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import React from 'react'
import { Button, Segment } from 'semantic-ui-react'

function TeacherTermsListItem({ linkToBase, TermId, TeacherId }) {
  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid
          Left={<TermHeader TermId={TermId} />}
          Right={
            <Button as={Link} to={`${linkToBase}${TermId}`}>
              Open
            </Button>
          }
        />
      </Segment>
    </Permit>
  )
}

export default TeacherTermsListItem
