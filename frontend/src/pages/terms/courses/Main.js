import { Router } from '@reach/router'
import StudentFeedbacks from 'components/Data/StudentFeedbacks/Student/Show.js'
import React from 'react'
import AssignSections from './AssignSections.js'
import AssignTeachers from './AssignTeachers.js'
import List from './List.js'
import View from './View.js'

function TermCourses({ TermId }) {
  return (
    <Router>
      <List path="/" TermId={TermId} linkToBase="courses/" />
      <List path="courses" TermId={TermId} linkToBase="" />

      <View path="courses/:CourseId" TermId={TermId} />
      <AssignSections
        path="courses/:CourseId/assign-sections"
        TermId={TermId}
      />
      <AssignTeachers
        path="courses/:CourseId/assign-teachers"
        TermId={TermId}
      />
      <StudentFeedbacks
        path="courses/:CourseId/student-feedbacks"
        TermId={TermId}
      />
    </Router>
  )
}

export default TermCourses
