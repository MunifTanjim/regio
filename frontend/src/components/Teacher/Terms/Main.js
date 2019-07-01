import { Router } from '@reach/router'
import React from 'react'
import CoursesList from './Courses/List.js'
import CourseView from './Courses/View.js'
import List from './List.js'
import View from './View.js'
import Permit from 'components/Permit.js'

function TeacherTerms({ TeacherId }) {
  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Router>
        <List path="/" linkToBase="terms/" TeacherId={TeacherId} />
        <List path="terms" linkToBase="" TeacherId={TeacherId} />
        <View path="terms/:TermId" TeacherId={TeacherId} />

        <CoursesList
          path="terms/:TermId/courses"
          linkToBase=""
          TeacherId={TeacherId}
        />
        <CourseView
          path="terms/:TermId/courses/:CourseId/*"
          TeacherId={TeacherId}
        />
      </Router>
    </Permit>
  )
}

export default TeacherTerms
