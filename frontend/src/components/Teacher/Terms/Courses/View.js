import TeacherCourseAttendance from 'components/Data/CourseAttendance/Teacher/Main.js'
import CourseHeader from 'components/Data/CourseHeader.js'
import TeacherCourseMarks from 'components/Data/CourseMarks/Teacher/Main.js'
import StudentFeedbacks from 'components/Data/StudentFeedbacks/Student/Main.js'
import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function TeacherTermCourseView({
  TeacherId,
  TermId,
  CourseId,
  course,
  getCourse
}) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid
          Left={<CourseHeader CourseId={CourseId} />}
          Right={<TermHeader TermId={TermId} textAlign="right" />}
        />
      </Segment>

      <TeacherCourseAttendance
        TeacherId={TeacherId}
        TermId={TermId}
        CourseId={CourseId}
      />

      <TeacherCourseMarks
        TeacherId={TeacherId}
        TermId={TermId}
        CourseId={CourseId}
      />

      <StudentFeedbacks />
    </Permit>
  )
}

const mapStateToProps = ({ courses }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId)
})

const mapDispatchToProps = {
  getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherTermCourseView)
