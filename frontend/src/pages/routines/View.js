import HeaderGrid from 'components/HeaderGrid'
import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Terms from './terms/Main.js'

function RoutinesView() {
  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Routines</Header>} />
      </Segment>

      <Terms />
    </>
  )
}

export default RoutinesView
