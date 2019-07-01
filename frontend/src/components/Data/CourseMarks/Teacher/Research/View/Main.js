import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { getResearchEnrollments } from 'store/actions/terms.js'
import ResearchMarksTable from './ResearchMarksTable.js'

function TeacherCourseMarksResearchView({
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
    <>
      <Segment>
        <HeaderGrid Left={<Header>Research Marks</Header>} />
      </Segment>

      <ResearchMarksTable
        markIdsByStudent={markIdsByStudent}
        CourseId={CourseId}
      />
    </>
  )
}

const mapStateToProps = ({ enrollments }) => ({
  enrollments
})

const mapDispatchToProps = {
  getResearchEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksResearchView)
