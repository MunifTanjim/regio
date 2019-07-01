import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'

function SessionYears() {
  return (
    <Permit sysadmin head>
      <Router>
        <List path="/" />
      </Router>
    </Permit>
  )
}

export default SessionYears
