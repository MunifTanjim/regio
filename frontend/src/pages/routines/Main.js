import { Router } from '@reach/router'
import React from 'react'
import View from './View.js'

function Routines() {
  return (
    <Router>
      <View path="/*" />
    </Router>
  )
}

export default Routines
