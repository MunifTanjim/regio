import { get, isNull, sum } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import calculateGrade from 'utils/calculate-grade'

function _MarksRow({ course, mark, StudentId }) {
  const data = useMemo(() => {
    const _data = {}

    _data.viva = get(mark, 'viva', null)
    _data.external = get(mark, 'external', null)
    _data.internal = get(mark, 'internal', null)

    const numbers = [_data.viva, _data.external, _data.internal]

    if (!numbers.some(isNull)) {
      _data.obtained = sum(numbers.map(Number))
    }

    _data.total = Number(get(course, 'creditHr')) * 100

    if (Number.isFinite(_data.obtained)) {
      const { point, letter } = calculateGrade(_data.obtained, _data.total, {
        isTheory: false
      })

      _data.gradePoint = point
      _data.gradeLetter = letter
    }

    return _data
  }, [course, mark])

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      <Table.Cell textAlign="center">{data.viva}</Table.Cell>
      <Table.Cell textAlign="center">{data.external}</Table.Cell>
      <Table.Cell textAlign="center">{data.internal}</Table.Cell>
      <Table.Cell textAlign="right">{data.obtained}</Table.Cell>
      <Table.Cell textAlign="right">{data.total}</Table.Cell>
      <Table.Cell textAlign="center">{data.gradePoint}</Table.Cell>
      <Table.Cell textAlign="center">{data.gradeLetter}</Table.Cell>
    </Table.Row>
  )
}

const _mapStateToProps = ({ courses, marks }, { CourseId, markId }) => ({
  course: get(courses.items.byId, CourseId),
  mark: get(marks.research.items.byId, markId)
})

const MarksRow = connect(_mapStateToProps)(memo(_MarksRow))

function ResearchMarksTable({ CourseId, markIdsByStudent }) {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Viva</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            External Examiner
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Superviser</Table.HeaderCell>
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
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default ResearchMarksTable
