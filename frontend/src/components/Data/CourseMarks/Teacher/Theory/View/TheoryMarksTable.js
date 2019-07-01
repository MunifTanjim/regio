import { get, isNull, sum } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import calculateGrade from 'utils/calculate-grade'

function _MarksRow({ course, theoryMark, StudentId, isShort }) {
  const data = useMemo(() => {
    const _data = {}

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
  }, [course.creditHr, isShort, theoryMark])

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      <Table.Cell textAlign="center">{data.attendance}</Table.Cell>
      <Table.Cell textAlign="center">{data.classTests}</Table.Cell>
      <Table.Cell textAlign="center">{data.finalExamSectionA}</Table.Cell>
      <Table.Cell textAlign="center">{data.finalExamSectionB}</Table.Cell>
      <Table.Cell textAlign="right">{data.obtained}</Table.Cell>
      <Table.Cell textAlign="right">{data.total}</Table.Cell>
      <Table.Cell textAlign="center">{data.gradePoint}</Table.Cell>
      <Table.Cell textAlign="center">{data.gradeLetter}</Table.Cell>
    </Table.Row>
  )
}

const _mapStateToProps = ({ courses, marks }, { CourseId, markId }) => ({
  course: get(courses.items.byId, CourseId),
  theoryMark: get(marks.theory.items.byId, markId)
})

const MarksRow = connect(_mapStateToProps)(memo(_MarksRow))

function TheoryMarksTable({
  CourseId,
  theoryMarkIdsByStudent,
  shortEnrolledStudentIds
}) {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Attendance</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Class Tests</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            Final Exam (Sec. A)
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            Final Exam (Sec. B)
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Obtained Marks</Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Total Marks</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Grade Point</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Grade</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(theoryMarkIdsByStudent).map(([StudentId, markId]) => (
          <MarksRow
            key={markId}
            CourseId={CourseId}
            StudentId={StudentId}
            markId={markId}
            isShort={shortEnrolledStudentIds.includes(Number(StudentId))}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default TheoryMarksTable
