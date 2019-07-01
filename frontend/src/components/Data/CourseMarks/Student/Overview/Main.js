import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import ClassTests from './ClassTests.js'
import Theory from './Theory.js'
import Sessional from './Sessional.js'
import Research from './Research.js'

function StudentCourseMarksOverview({
  TermId,
  CourseId,
  StudentId,
  courseType
}) {
  switch (courseType) {
    case 'theory':
      return (
        <>
          <ClassTests
            TermId={TermId}
            CourseId={CourseId}
            StudentId={StudentId}
            title={`Class Test Marks`}
          />
          <Theory
            TermId={TermId}
            CourseId={CourseId}
            StudentId={StudentId}
            title={`Result`}
          />
        </>
      )
    case 'sessional':
      return (
        <Sessional
          TermId={TermId}
          CourseId={CourseId}
          StudentId={StudentId}
          title={`Result`}
        />
      )
    case 'supervised':
      return (
        <Research
          TermId={TermId}
          CourseId={CourseId}
          StudentId={StudentId}
          title={`Result`}
        />
      )
    default:
      return null
  }
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  courseType: get(courses.items.byId, [CourseId, 'type'])
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseMarksOverview)
