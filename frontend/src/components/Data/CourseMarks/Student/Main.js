import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCourse } from 'store/actions/courses.js'
import {
  getClassTestMarksForStudent,
  getTheoryMarkForStudent,
  getSessionalMarkForStudent,
  getResearchMarkForStudent
} from 'store/actions/students.js'
import Overview from './Overview/Main.js'
import View from './View.js'

function StudentCourseMarks({
  TermId,
  CourseId,
  StudentId,
  courseType,
  getCourse,
  getClassTestMarksForStudent,
  getTheoryMarkForStudent,
  getSessionalMarkForStudent,
  getResearchMarkForStudent
}) {
  useEffect(() => {
    if (!courseType) getCourse(CourseId)
  }, [CourseId, courseType, getCourse])

  useEffect(() => {
    if (courseType === 'theory') {
      getClassTestMarksForStudent(StudentId, TermId, CourseId)
      getTheoryMarkForStudent(StudentId, TermId, CourseId)
    } else if (courseType === 'sessional') {
      getSessionalMarkForStudent(StudentId, TermId, CourseId)
    } else if (courseType === 'supervised') {
      getResearchMarkForStudent(StudentId, TermId, CourseId)
    }
  }, [TermId, CourseId, StudentId, courseType, getClassTestMarksForStudent, getTheoryMarkForStudent, getSessionalMarkForStudent, getResearchMarkForStudent])

  return (
    <Permit sysadmin head teacher UserId={`${StudentId}`}>
      <Router>
        <Overview path="/" linkToBase="marks/" StudentId={StudentId} />

        <View path="marks" linkToBase="" StudentId={StudentId} />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  courseType: get(courses.items.byId, [CourseId, 'type'], null)
})

const mapDispatchToProps = {
  getCourse,
  getClassTestMarksForStudent,
  getTheoryMarkForStudent,
  getSessionalMarkForStudent,
  getResearchMarkForStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseMarks)
