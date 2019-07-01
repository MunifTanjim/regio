import StudentCourseAttendance from 'components/Data/CourseAttendance/Student/Main.js'
import CourseHeader from 'components/Data/CourseHeader.js'
import StudentCourseMarks from 'components/Data/CourseMarks/Student/Main.js'
import StudentFeedbacks from 'components/Data/StudentFeedbacks/Student/Main'
import TermHeader from 'components/Data/TermHeader.js'
import HeaderGrid from 'components/HeaderGrid.js'
import React from 'react'
import { Segment } from 'semantic-ui-react'

function StudentTermCourse({ StudentId, TermId, CourseId }) {
  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<CourseHeader CourseId={CourseId} />}
          Right={<TermHeader TermId={TermId} textAlign="right" />}
        />
      </Segment>

      <StudentCourseAttendance
        TermId={TermId}
        CourseId={CourseId}
        StudentId={StudentId}
      />

      <StudentCourseMarks
        TermId={TermId}
        CourseId={CourseId}
        StudentId={StudentId}
      />

      <StudentFeedbacks
        TermId={TermId}
        CourseId={CourseId}
        StudentId={StudentId}
      />
    </>
  )
}

export default StudentTermCourse
