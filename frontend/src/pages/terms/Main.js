import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import List from './List.js'
import View from './View.js'

function Terms() {
  return (
    <Permit sysadmin head teacher>
      <Router>
        <List path="/" />
        <View path=":TermId/*" />
      </Router>
    </Permit>
  )
}

export default Terms
