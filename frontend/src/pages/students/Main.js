import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'
import View from './View.js'
import Create from './Create.js'

function Students() {
  return (
    <Permit sysadmin head teacher>
      <Router>
        <List path="/" />
        <Create path="create" />
        <View path="/:StudentId/*" />
      </Router>
    </Permit>
  )
}

export default Students
