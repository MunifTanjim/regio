import HeaderGrid from 'components/HeaderGrid'
import { get, zipObject } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Header, Segment } from 'semantic-ui-react'
import { getEnrollments } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import SessionalMarksTable from './SessionalMarksTable.js'

const emptyArray = []

function TeacherCourseMarksSessionalView({
  TeacherId,
  TermId,
  CourseId,
  enrollments,
  getEnrollments,
  sections = emptyArray
}) {
  useEffect(() => {
    getEnrollments(TermId, CourseId)
  }, [TermId, CourseId, getEnrollments])

  const [section, setSection] = useState()

  useEffect(() => {
    if (sections[0]) setSection(sections[0])
  }, [sections])

  const enrollmentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    return enrollments.items.allIds
      .filter(id => regex.test(id))
      .filter(id => get(enrollments.items.byId, [id, 'section']) === section)
  }, [
    CourseId,
    TermId,
    enrollments.items.allIds,
    enrollments.items.byId,
    section
  ])

  const StudentIds = useMemo(() => {
    return enrollmentIds
      .map(id => get(enrollments.items.byId, [id, 'StudentId']))
      .sort()
  }, [enrollmentIds, enrollments.items.byId])

  const shortEnrolledStudentIds = useMemo(() => {
    return enrollmentIds
      .filter(id => get(enrollments.items.byId, [id, 'type']) === 'short')
      .map(id => get(enrollments.items.byId, [id, 'StudentId']))
  }, [enrollmentIds, enrollments.items.byId])

  const markIdsByStudent = useMemo(() => {
    return StudentIds.reduce((idsByStudent, StudentId) => {
      idsByStudent[StudentId] = `${TermId}_${CourseId}_${StudentId}`
      return idsByStudent
    }, {})
  }, [StudentIds, TermId, CourseId])

  const sectionOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(sections, sections))
  }, [sections])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Sessional Marks [Section {section}]</Header>}
          Right={
            <Dropdown
              search
              selection
              compact
              value={section}
              options={sectionOptions}
              onChange={(_, { value }) => {
                setSection(value)
              }}
            />
          }
        />
      </Segment>

      <SessionalMarksTable
        markIdsByStudent={markIdsByStudent}
        shortEnrolledStudentIds={shortEnrolledStudentIds}
        CourseId={CourseId}
      />
    </>
  )
}

const mapStateToProps = (
  { enrollments, termcourses },
  { TermId, CourseId, TeacherId }
) => ({
  enrollments,
  sections: get(termcourses.sectionsByTeacherId, [
    `${TermId}_${CourseId}`,
    TeacherId
  ])
})

const mapDispatchToProps = {
  getEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseMarksSessionalView)
