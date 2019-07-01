import React from 'react'

import { Router } from '@reach/router'

import View from './View/Main.js'
import Edit from './Edit/Main.js'

function TeacherCourseMarksTheory({ TeacherId }) {
  return (
    <Router>
      <View path="/" TeacherId={TeacherId} />
      <Edit path="edit" TeacherId={TeacherId} />
    </Router>
  )
}

export default TeacherCourseMarksTheory
