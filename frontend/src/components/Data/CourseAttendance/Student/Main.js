import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCourse } from 'store/actions/courses.js'
import { getAttendancesForStudent } from 'store/actions/students.js'
import Overview from './Overview.js'

function StudentCourseAttendance({
  TermId,
  CourseId,
  StudentId,
  courseType,
  getCourse,
  getAttendancesForStudent
}) {
  useEffect(() => {
    if (!courseType) getCourse(CourseId)
  }, [CourseId, courseType, getCourse])

  useEffect(() => {
    if (courseType && courseType !== 'supervised') {
      getAttendancesForStudent(StudentId, TermId, CourseId)
    }
  }, [TermId, CourseId, StudentId, courseType, getAttendancesForStudent])

  if (!courseType || courseType === 'supervised') return null

  return (
    <Permit sysadmin head teacher UserId={`${StudentId}`}>
      <Router>
        <Overview
          path="/"
          title={`Attendance Overview`}
          StudentId={StudentId}
        />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  courseType: get(courses.items.byId, [CourseId, 'type'], null)
})

const mapDispatchToProps = {
  getCourse,
  getAttendancesForStudent
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseAttendance)
