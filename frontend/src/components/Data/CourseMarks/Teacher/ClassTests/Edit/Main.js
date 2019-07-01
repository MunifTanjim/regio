import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Header, Segment } from 'semantic-ui-react'
import { getEnrollments } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import ClassTestMarksForm from './Form.js'

const emptyArray = []

function TeacherTermCourseMarksClassTestsEdit({
  TeacherId,
  TermId,
  CourseId,
  course,
  classTestMarks,
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
      .filter(id => get(enrollments.items.byId, [id, 'type']) !== 'short')
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

  const classTestMarkIdsByStudent = useMemo(() => {
    return StudentIds.reduce((idsByStudent, StudentId) => {
      const idPattern = RegExp(`^${TermId}_${CourseId}_${StudentId}_`)

      idsByStudent[StudentId] = get(
        classTestMarks.items.groupedIdsByTerm,
        TermId,
        []
      ).filter(id => idPattern.test(id))

      return idsByStudent
    }, {})
  }, [CourseId, StudentIds, TermId, classTestMarks.items.groupedIdsByTerm])

  const ctNumbers = useMemo(() => {
    const numbers = []
    if (course) {
      const maxNumber = Math.ceil(get(course, 'creditHr')) + 1
      for (let i = 0; i < maxNumber; i++) {
        numbers.push(String(i + 1))
      }
    }
    return numbers
  }, [course])

  const ctOptions = useMemo(() => {
    return ctNumbers.reduce((opts, number) => {
      opts.push({ text: `CT ${number}`, value: `${number}` })
      return opts
    }, [])
  }, [ctNumbers])

  const [ctNumber, setCtNumber] = useState(`1`)

  const onChangeCtNumber = useCallback((_, { value }) => {
    setCtNumber(value)
  }, [])

  const sectionOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(sections, sections))
  }, [sections])

  return (
    <Permit UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid
          Left={<Header>Edit Class Test Marks [Section {section}]</Header>}
          Right={
            <>
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

              <Dropdown
                search
                selection
                value={ctNumber}
                options={ctOptions}
                onChange={onChangeCtNumber}
              />
            </>
          }
        />
      </Segment>

      <ClassTestMarksForm
        TeacherId={TeacherId}
        TermId={TermId}
        CourseId={CourseId}
        StudentIds={StudentIds}
        classTestMarkIdsByStudent={classTestMarkIdsByStudent}
        ctNumbers={ctNumbers}
        ctNumber={ctNumber}
      />
    </Permit>
  )
}

const mapStateToProps = (
  { courses, enrollments, marks, termcourses },
  { TermId, CourseId, TeacherId }
) => ({
  course: get(courses.items.byId, CourseId),
  classTestMarks: marks.classtest,
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
)(TeacherTermCourseMarksClassTestsEdit)
