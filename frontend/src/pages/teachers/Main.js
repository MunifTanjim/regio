import { Router } from '@reach/router'
import React from 'react'
import Create from './Create.js'
import List from './List.js'
import View from './View.js'

function Teachers() {
  return (
    <Router>
      <List path="/" />
      <Create path="create" />
      <View path="/:TeacherId/*" />
    </Router>
  )
}

export default Teachers
