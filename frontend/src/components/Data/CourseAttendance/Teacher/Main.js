import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCourse } from 'store/actions/courses.js'
import {
  getAttendances,
  getEnrollments,
  getTermCourseTeachers
} from 'store/actions/terms.js'
import Edit from './Edit.js'
import Overview from './Overview.js'
import View from './View.js'

function TeacherCourseAttendance({
  TeacherId,
  TermId,
  CourseId,
  courseType,
  getCourse,
  getAttendances,
  getEnrollments,
  getTermCourseTeachers
}) {
  useEffect(() => {
    getTermCourseTeachers(TermId, { query: `filter=CourseId==${CourseId}` })
  }, [CourseId, TermId, getTermCourseTeachers])

  useEffect(() => {
    if (!courseType) getCourse(CourseId)
  }, [CourseId, courseType, getCourse])

  useEffect(() => {
    if (courseType && courseType !== 'supervised') {
      getAttendances(TermId, CourseId)
      getEnrollments(TermId, CourseId)
    }
  }, [TermId, CourseId, courseType, getAttendances, getEnrollments])

  if (!courseType || courseType === 'supervised') return null

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Router>
        <Overview
          path="/"
          title={`Attendance Overview`}
          TeacherId={TeacherId}
        />

        <View path="/attendances" TeacherId={TeacherId} />

        <Edit path="/attendances/edit" TeacherId={TeacherId} />

        <Edit
          path="/attendances/take"
          todayDate={DateTime.local().toISODate()}
          TeacherId={TeacherId}
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
  getAttendances,
  getEnrollments,
  getTermCourseTeachers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseAttendance)
