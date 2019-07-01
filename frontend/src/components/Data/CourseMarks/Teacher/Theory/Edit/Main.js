import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get, zipObject } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Header, Segment } from 'semantic-ui-react'
import { getEnrollments } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import TeacherCourseMarksTheoryEditForm from './Form.js'

const emptyArray = []

function TeacherCourseMarksTheoryEdit({
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

  const StudentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    const enrollmentIds = enrollments.items.allIds
      .filter(id => regex.test(id))
      .filter(id => get(enrollments.items.byId, [id, 'section']) === section)

    return enrollmentIds
      .map(id => get(enrollments.items.byId, [id, 'StudentId']))
      .sort()
  }, [
    TermId,
    CourseId,
    enrollments.items.allIds,
    enrollments.items.byId,
    section
  ])

  const theoryMarkIdsByStudent = useMemo(() => {
    return StudentIds.reduce((idsByStudent, StudentId) => {
      idsByStudent[StudentId] = `${TermId}_${CourseId}_${StudentId}`
      return idsByStudent
    }, {})
  }, [StudentIds, TermId, CourseId])

  const sectionOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(sections, sections))
  }, [sections])

  return (
    <Permit UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid
          Left={<Header>Edit Theory Marks [Section {section}]</Header>}
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

      <TeacherCourseMarksTheoryEditForm
        TeacherId={TeacherId}
        TermId={TermId}
        CourseId={CourseId}
        theoryMarkIdsByStudent={theoryMarkIdsByStudent}
      />
    </Permit>
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
)(TeacherCourseMarksTheoryEdit)
