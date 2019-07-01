import { Router } from '@reach/router'
import React from 'react'
import List from './List.js'
import View from './View.js'

function RoutineTerms() {
  return (
    <Router>
      <List path="/" linkToBase="terms/" />
      <List path="terms" linkToBase="" />

      <View path="terms/:TermId/*" />
    </Router>
  )
}

export default RoutineTerms
