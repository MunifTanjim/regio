import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'

function StudentEnrollments({ StudentId }) {
  return (
    <Permit sysadmin head teacher UserId={StudentId}>
      <Router>
        <List path="/" StudentId={StudentId} />
      </Router>
    </Permit>
  )
}

export default StudentEnrollments
