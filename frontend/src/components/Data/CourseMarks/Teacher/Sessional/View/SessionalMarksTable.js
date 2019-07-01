import { get, isNull, sum } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import calculateGrade from 'utils/calculate-grade'

function _MarksRow({ course, mark, StudentId, isShort }) {
  const data = useMemo(() => {
    const _data = {}

    _data.attendance = get(mark, 'attendance', null)
    _data.performanceAndReports = get(mark, 'performanceAndReports', null)
    _data.finalQuiz = get(mark, 'finalQuiz', null)
    _data.finalViva = get(mark, 'finalViva', null)

    const numbers = [
      _data.attendance,
      _data.performanceAndReports,
      _data.finalQuiz,
      _data.finalViva
    ]

    if (!numbers.some(isNull)) {
      _data.obtained = sum(numbers.map(Number))
    }

    _data.total = Number(course.creditHr) * 100

    if (Number.isFinite(_data.obtained)) {
      const { point, letter } = calculateGrade(_data.obtained, _data.total, {
        isShort
      })
      _data.gradePoint = point
      _data.gradeLetter = letter
    }

    return _data
  }, [course.creditHr, isShort, mark])

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      <Table.Cell textAlign="center">{data.attendance}</Table.Cell>
      <Table.Cell textAlign="center">{data.performanceAndReports}</Table.Cell>
      <Table.Cell textAlign="center">{data.finalQuiz}</Table.Cell>
      <Table.Cell textAlign="center">{data.finalViva}</Table.Cell>
      <Table.Cell textAlign="right">{data.obtained}</Table.Cell>
      <Table.Cell textAlign="right">{data.total}</Table.Cell>
      <Table.Cell textAlign="center">{data.gradePoint}</Table.Cell>
      <Table.Cell textAlign="center">{data.gradeLetter}</Table.Cell>
    </Table.Row>
  )
}

const _mapStateToProps = ({ courses, marks }, { CourseId, markId }) => ({
  course: get(courses.items.byId, CourseId),
  mark: get(marks.sessional.items.byId, markId)
})

const MarksRow = connect(_mapStateToProps)(memo(_MarksRow))

function SessionalMarksTable({
  CourseId,
  markIdsByStudent,
  shortEnrolledStudentIds
}) {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Attendance</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            Performance & Reports
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Final Quiz</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Final Viva</Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Obtained Marks</Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Total Marks</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Grade Point</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Grade</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(markIdsByStudent).map(([StudentId, markId]) => (
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

export default SessionalMarksTable
