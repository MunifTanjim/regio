import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getTermCourse } from 'store/actions/terms.js'
import Overview from './Overview.js'
import Show from './Show.js'
import Give from './Give.js'

function StudentFeedbacks({
  TermId,
  CourseId,
  StudentId,
  termcourse,
  getTermCourse
}) {
  useEffect(() => {
    if (!termcourse) getTermCourse(TermId, CourseId)
  }, [CourseId, TermId, getTermCourse, termcourse])

  return (
    <Permit sysadmin head teacher student>
      <Router>
        <Overview path="/" />
        <Give path="give-student-feedback" />
        <Show path="student-feedbacks" />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ termcourses }, { TermId, CourseId }) => ({
  termcourse: get(termcourses.items.byId, `${TermId}_${CourseId}`)
})

const mapDispatchToProps = {
  getTermCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentFeedbacks)
