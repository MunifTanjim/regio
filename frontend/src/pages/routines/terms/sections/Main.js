import { Router } from '@reach/router'
import React from 'react'
import Edit from './Edit.js'
import List from './List.js'
import View from './View.js'
import EditWeekPlan from './EditWeekPlan.js'

function RoutineTermSections({ TermId }) {
  return (
    <Router>
      <List path="/" linkToBase="sections/" TermId={TermId} />
      <List path="sections" linkToBase="" TermId={TermId} />

      <View path="sections/:section" TermId={TermId} />
      <Edit path="sections/:section/edit" TermId={TermId} />
      <EditWeekPlan path="sections/:section/edit-weekplan" TermId={TermId} />
    </Router>
  )
}

export default RoutineTermSections
