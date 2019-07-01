import { get, isNull, isNumber, keyBy, mapValues } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'

function _MarksRow({
  ctNumber,
  ctNumbers,
  classTestMarks,
  StudentId,
  markIds
}) {
  const ctMarksByNumber = useMemo(() => {
    const marks = markIds.map(id => get(classTestMarks.items.byId, id))
    return mapValues(keyBy(marks, 'number'), 'mark')
  }, [markIds, classTestMarks])

  const data = useMemo(() => {
    const _data = { obtained: 0 }

    if (ctNumber === 'all') {
      const sortedMarks = ctNumbers
        .map(number => get(ctMarksByNumber, number))
        .map(mark => (isNull(mark) ? '' : Number(mark)))
        .filter(isNumber)
        .sort()

      const countedClassTestsNumber = ctNumbers.length - 1

      for (let index = 0; index < countedClassTestsNumber; index++) {
        _data.obtained += sortedMarks[index] || 0
      }

      _data.total = countedClassTestsNumber * 20
    } else {
      _data.obtained = get(ctMarksByNumber, ctNumber)
      _data.total = 20
    }

    if (isNull(_data.obtained)) _data.obtained = ''

    return _data
  }, [ctNumber, ctNumbers, ctMarksByNumber])

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      {ctNumber === 'all' &&
        ctNumbers.map(number => (
          <Table.Cell key={`td-ct${number}`} textAlign="center">
            {get(ctMarksByNumber, number)}
          </Table.Cell>
        ))}
      <Table.Cell collapsing textAlign="right">
        {data.obtained}
      </Table.Cell>
      <Table.Cell collapsing textAlign="right">
        {data.total}
      </Table.Cell>
    </Table.Row>
  )
}

const mapStateToProps = ({ marks, students }) => ({
  classTestMarks: marks.classtest
})

const MarksRow = connect(mapStateToProps)(memo(_MarksRow))

function ClassTestMarksTable({
  StudentIds,
  classTestMarkIdsByStudent,
  ctNumbers,
  ctNumber
}) {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          {ctNumber === 'all' &&
            ctNumbers.map(number => (
              <Table.HeaderCell key={`th-ct${number}`} textAlign="center">
                CT {number}
              </Table.HeaderCell>
            ))}
          <Table.HeaderCell collapsing textAlign="right">
            Obtained Marks
          </Table.HeaderCell>
          <Table.HeaderCell collapsing textAlign="right">
            Total Marks
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {StudentIds.map(StudentId => (
          <MarksRow
            key={StudentId}
            StudentId={StudentId}
            markIds={classTestMarkIdsByStudent[StudentId]}
            ctNumber={ctNumber}
            ctNumbers={ctNumbers}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default ClassTestMarksTable
