import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'
import View from './View.js'

function Students() {
  return (
    <Permit sysadmin head teacher>
      <Router>
        <List path="/" />
        <View path="/:StudentId/*" />
      </Router>
    </Permit>
  )
}

export default Students
