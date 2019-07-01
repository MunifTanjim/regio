import HeaderGrid from 'components/HeaderGrid'
import { get, isNull, sum } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Header, Segment, Table } from 'semantic-ui-react'
import { getTermCourseEnrollment } from 'store/actions/students.js'
import calculateGrade from 'utils/calculate-grade'

function StudentCourseMarksOverviewSessional({
  StudentId,
  TermId,
  CourseId,
  course,
  sessionalMarks,
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
      sessionalMarks.items.byId,
      `${TermId}_${CourseId}_${StudentId}`
    )

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
  }, [
    sessionalMarks.items.byId,
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
            <Table.HeaderCell textAlign="center">
              Performance & Reports
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Final Quiz</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Final Viva</Table.HeaderCell>
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
            <Table.Cell textAlign="center">
              {data.performanceAndReports}
            </Table.Cell>
            <Table.Cell textAlign="center">{data.finalQuiz}</Table.Cell>
            <Table.Cell textAlign="center">{data.finalViva}</Table.Cell>
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
  sessionalMarks: marks.sessional
})

const mapDispatchToProps = { getTermCourseEnrollment }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentCourseMarksOverviewSessional)
