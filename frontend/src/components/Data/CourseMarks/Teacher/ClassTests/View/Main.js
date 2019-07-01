import HeaderGrid from 'components/HeaderGrid'
import PrintButtonTeleport from 'components/Navbar/PrintButtonTeleport.js'
import { get, uniq, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Header, Segment } from 'semantic-ui-react'
import { getEnrollments } from 'store/actions/terms.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import ClassTestMarksTable from './ClassTestMarksTable.js'

const ctOptionAll = { text: 'All', value: 'all' }

function TeacherTermCourseMarksClassTestsView({
  TeacherId,
  TermId,
  CourseId,
  course,
  classTestMarks,
  enrollments,
  getEnrollments
}) {
  useEffect(() => {
    getEnrollments(TermId, CourseId)
  }, [TermId, CourseId, getEnrollments])

  const enrollmentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    return enrollments.items.allIds.filter(id => regex.test(id))
  }, [CourseId, TermId, enrollments.items.allIds])

  const sections = useMemo(() => {
    return uniq(
      enrollmentIds.map(id => get(enrollments.items.byId, [id, 'section']))
    )
  }, [enrollmentIds, enrollments.items.byId])

  const [section, setSection] = useState()

  useEffect(() => {
    setSection(sections[0])
  }, [sections])

  const sectionOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(sections, sections))
  }, [sections])

  const StudentIds = useMemo(() => {
    return enrollmentIds
      .filter(id => get(enrollments.items.byId, [id, 'section']) === section)
      .map(id => get(enrollments.items.byId, [id, 'StudentId']))
  }, [enrollmentIds, enrollments.items.byId, section])

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
    return ctNumbers.reduce(
      (opts, number) => {
        opts.push({ text: `CT ${number}`, value: `${number}` })
        return opts
      },
      [ctOptionAll]
    )
  }, [ctNumbers])

  const [ctNumber, setCtNumber] = useState(`1`)

  const onChangeCtNumber = useCallback((_, { value }) => {
    setCtNumber(value)
  }, [])

  return (
    <>
      <Segment>
        <PrintButtonTeleport.Source>
          <Button
            icon="print"
            as={'a'}
            target="_blank"
            href={`/print/terms/${TermId}/courses/${CourseId}/section/${section}/marks/classtests/?TeacherId=${TeacherId}`}
          />
        </PrintButtonTeleport.Source>
        <HeaderGrid
          Left={<Header>Class Test Marks [Section {section}]</Header>}
          Right={
            <>
              <Dropdown
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

      <ClassTestMarksTable
        StudentIds={StudentIds}
        classTestMarkIdsByStudent={classTestMarkIdsByStudent}
        ctNumbers={ctNumbers}
        ctNumber={ctNumber}
      />
    </>
  )
}

const mapStateToProps = ({ courses, enrollments, marks }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId),
  classTestMarks: marks.classtest,
  enrollments
})

const mapDispatchToProps = {
  getEnrollments
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherTermCourseMarksClassTestsView)
