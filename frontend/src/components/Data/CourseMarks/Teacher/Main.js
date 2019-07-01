import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCourse } from 'store/actions/courses.js'
import {
  getClassTestMarks,
  getResearchMarks,
  getSessionalMarks,
  getTheoryMarks
} from 'store/actions/teachers.js'
import { getTermCourseTeachers } from 'store/actions/terms.js'
import ClassTests from './ClassTests/Main.js'
import Overview from './Overview/Main.js'
import Research from './Research/Main.js'
import Sessional from './Sessional/Main.js'
import Theory from './Theory/Main.js'
import View from './View.js'

function TeacherCourseMarks({
  TeacherId,
  TermId,
  CourseId,
  courseType,
  getCourse,
  getClassTestMarks,
  getTheoryMarks,
  getSessionalMarks,
  getResearchMarks,
  getTermCourseTeachers
}) {
  useEffect(() => {
    if (!courseType) getCourse(CourseId)
  }, [CourseId, courseType, getCourse])

  useEffect(() => {
    if (courseType === 'theory') {
      getClassTestMarks(TeacherId, TermId, CourseId)
      getTheoryMarks(TeacherId, TermId, CourseId)
    } else if (courseType === 'sessional') {
      getSessionalMarks(TeacherId, TermId, CourseId)
    } else if (courseType === 'supervised') {
      getResearchMarks(TeacherId, TermId, CourseId)
    }
  }, [
    TeacherId,
    TermId,
    CourseId,
    courseType,
    getClassTestMarks,
    getTheoryMarks,
    getSessionalMarks,
    getResearchMarks
  ])

  useEffect(() => {
    if (courseType && courseType !== 'supervised') {
      getTermCourseTeachers(TermId, { query: `filter=CourseId==${CourseId}` })
    }
  }, [CourseId, TermId, courseType, getTermCourseTeachers])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Router>
        <Overview path="/" linkToBase="marks/" TeacherId={TeacherId} />
        <View path="marks" linkToBase="" TeacherId={TeacherId} />

        <Theory path="marks/theory/*" TeacherId={TeacherId} />
        <ClassTests path="marks/classtests/*" TeacherId={TeacherId} />
        <Sessional path="marks/sessional/*" TeacherId={TeacherId} />
        <Research path="marks/research/*" TeacherId={TeacherId} />
      </Router>
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  courseType: get(courses.items.byId, [CourseId, 'type'], null)
})

const mapDispatchToProps = {
  getCourse,
  getClassTestMarks,
  getTheoryMarks,
  getSessionalMarks,
  getResearchMarks,
  getTermCourseTeachers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarks)
