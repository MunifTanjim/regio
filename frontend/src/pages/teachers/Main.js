import React from 'react'
import { Router } from '@reach/router'

import List from './List.js'
import View from './View.js'

function Teachers() {
  return (
    <Router>
      <List path="/" />
      <View path="/:TeacherId/*" />
    </Router>
  )
}

export default Teachers
