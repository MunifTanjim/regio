import HeaderGrid from 'components/HeaderGrid'
import { get, isNull, sum } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Table } from 'semantic-ui-react'
import { getTermCourseEnrollment } from 'store/actions/students.js'
import calculateGrade from 'utils/calculate-grade'

function StudentCourseMarksOverviewResearch({
  StudentId,
  TermId,
  CourseId,
  course,
  researchMarks,
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

    const mark = get(
      researchMarks.items.byId,
      `${TermId}_${CourseId}_${StudentId}`
    )

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
        isShort,
        isTheory: false
      })

      _data.gradePoint = point
      _data.gradeLetter = letter
    }

    return _data
  }, [researchMarks.items.byId, TermId, CourseId, StudentId, course, isShort])

  return (
    <Segment>
      <HeaderGrid Left={<Header>{title}</Header>} />

      <Table celled basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Viva</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">
              External Examiner
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Superviser</Table.HeaderCell>
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
            <Table.Cell textAlign="center">{data.viva}</Table.Cell>
            <Table.Cell textAlign="center">{data.external}</Table.Cell>
            <Table.Cell textAlign="center">{data.internal}</Table.Cell>
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
  researchMarks: marks.research
})

const mapDispatchToProps = { getTermCourseEnrollment }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseMarksOverviewResearch)
