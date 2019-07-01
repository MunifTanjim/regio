import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { getResearchEnrollments } from 'store/actions/terms.js'
import TeacherCourseMarksResearchEditForm from './Form.js'

function TeacherCourseMarksResearchEdit({
  TeacherId,
  TermId,
  CourseId,
  enrollments,
  getResearchEnrollments
}) {
  useEffect(() => {
    getResearchEnrollments(TermId, CourseId)
  }, [TermId, CourseId, getResearchEnrollments])

  const StudentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    const enrollmentIds = enrollments.researchItems.allIds.filter(id =>
      regex.test(id)
    )

    return enrollmentIds
      .map(id => get(enrollments.researchItems.byId, [id, 'StudentId']))
      .sort()
  }, [TermId, CourseId, enrollments])

  const markIdsByStudent = useMemo(() => {
    return StudentIds.reduce((idsByStudent, StudentId) => {
      idsByStudent[StudentId] = `${TermId}_${CourseId}_${StudentId}`
      return idsByStudent
    }, {})
  }, [StudentIds, TermId, CourseId])

  return (
    <Permit UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid Left={<Header>Edit Theory Marks</Header>} />
      </Segment>

      <TeacherCourseMarksResearchEditForm
        TeacherId={TeacherId}
        TermId={TermId}
        CourseId={CourseId}
        markIdsByStudent={markIdsByStudent}
      />
    </Permit>
  )
}

const mapStateToProps = ({ courses, enrollments }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId),
  enrollments
})

const mapDispatchToProps = {
  getResearchEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksResearchEdit)
