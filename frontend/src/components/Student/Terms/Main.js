import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React from 'react'
import CoursesList from './Courses/List.js'
import CourseView from './Courses/View.js'
import Enroll from './enroll/Main.js'
import Enrollments from './enrollments/Main.js'
import TermsList from './List.js'
import TermView from './View.js'

function StudentTerms({ StudentId }) {
  return (
    <Permit sysadmin head teacher UserId={StudentId}>
      <Router>
        <TermsList path="/" linkToBase="terms/" StudentId={StudentId} />
        <TermsList path="terms" linkToBase="" StudentId={StudentId} />
        <TermView path="terms/:TermId" StudentId={StudentId} />

        <CoursesList
          path="terms/:TermId/courses"
          linkToBase=""
          StudentId={StudentId}
        />
        <CourseView
          path="terms/:TermId/courses/:CourseId/*"
          StudentId={StudentId}
        />

        <Enroll path="terms/enroll" StudentId={StudentId} />
        <Enrollments path="terms/:TermId/enrollments/*" StudentId={StudentId} />
      </Router>
    </Permit>
  )
}

export default StudentTerms
