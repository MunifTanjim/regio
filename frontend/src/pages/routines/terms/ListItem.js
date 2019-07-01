import { Link } from '@reach/router'
import TermHeader from 'components/Data/TermHeader'
import HeaderGrid from 'components/HeaderGrid'
import React from 'react'
import { Button, Segment } from 'semantic-ui-react'

function RoutineTermsListItem({ id, linkToBase }) {
  return (
    <Segment>
      <HeaderGrid
        Left={<TermHeader TermId={id} />}
        Right={
          <Button color="blue" as={Link} to={`${linkToBase}${id}`}>
            View
          </Button>
        }
      />
    </Segment>
  )
}

export default RoutineTermsListItem
