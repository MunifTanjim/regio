import HeaderGrid from 'components/HeaderGrid'
import { get, isNull, sum } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Table } from 'semantic-ui-react'
import { getTermCourseEnrollment } from 'store/actions/students.js'
import calculateGrade from 'utils/calculate-grade'

function StudentCourseMarksOverviewTheory({
  StudentId,
  TermId,
  CourseId,
  course,
  theoryMarks,
  title,
  enrollments,
  getTermCourseEnrollment
}) {
  useEffect(() => {
    getTermCourseEnrollment(StudentId, TermId, CourseId)
  }, [CourseId, StudentId, TermId, getTermCourseEnrollment])

  const isShort = useMemo(() => {
    return (
      get(enrollments.items.byId, [
        `${TermId}_${CourseId}_${StudentId}`,
        'type'
      ]) === 'short'
    )
  }, [CourseId, StudentId, TermId, enrollments.items.byId])

  const data = useMemo(() => {
    const _data = {}

    const theoryMark = get(
      theoryMarks.items.byId,
      `${TermId}_${CourseId}_${StudentId}`
    )

    _data.attendance = get(theoryMark, 'attendance', null)
    _data.classTests = get(theoryMark, 'classTests', null)
    _data.finalExamSectionA = get(theoryMark, 'finalExamSectionA', null)
    _data.finalExamSectionB = get(theoryMark, 'finalExamSectionB', null)

    const numbers = [
      _data.attendance,
      _data.classTests,
      _data.finalExamSectionA,
      _data.finalExamSectionB
    ]

    if (!numbers.some(isNull)) {
      _data.obtained = sum(numbers.map(Number))
    }

    _data.total = Number(course.creditHr) * 100

    if (Number.isFinite(_data.obtained)) {
      const { point, letter } = calculateGrade(_data.obtained, _data.total, {
        isShort,
        isTheory: true
      })
      _data.gradePoint = point
      _data.gradeLetter = letter
    }

    return _data
  }, [
    theoryMarks.items.byId,
    TermId,
    CourseId,
    StudentId,
    course.creditHr,
    isShort
  ])

  return (
    <Segment>
      <HeaderGrid Left={<Header>{title}</Header>} />

      <Table celled basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Attendance</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Class Tests</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">
              Final Exam (Sec. A)
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">
              Final Exam (Sec. B)
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="right">
              Obtained Marks
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Total Marks</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Grade Point</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Grade</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell textAlign="center">{data.attendance}</Table.Cell>
            <Table.Cell textAlign="center">{data.classTests}</Table.Cell>
            <Table.Cell textAlign="center">{data.finalExamSectionA}</Table.Cell>
            <Table.Cell textAlign="center">{data.finalExamSectionB}</Table.Cell>
            <Table.Cell textAlign="right">{data.obtained}</Table.Cell>
            <Table.Cell textAlign="right">{data.total}</Table.Cell>
            <Table.Cell textAlign="center">{data.gradePoint}</Table.Cell>
            <Table.Cell textAlign="center">{data.gradeLetter}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Segment>
  )
}

const mapStateToProps = ({ courses, marks, enrollments }, { CourseId }) => ({
  course: get(courses.items.byId, CourseId),
  enrollments,
  theoryMarks: marks.theory
})

const mapDispatchToProps = { getTermCourseEnrollment }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseMarksOverviewTheory)
