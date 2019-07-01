import { Router } from '@reach/router'
import React from 'react'
import Edit from './Edit/Main.js'
import View from './View/Main.js'

function TeacherCourseMarksSessional({ TeacherId }) {
  return (
    <Router>
      <View path="/" TeacherId={TeacherId} />
      <Edit path="edit" TeacherId={TeacherId} />
    </Router>
  )
}

export default TeacherCourseMarksSessional
