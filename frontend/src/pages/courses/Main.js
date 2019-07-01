import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'

function Courses() {
  return (
    <Router>
      <List path="/" />
    </Router>
  )
}

export default Courses
