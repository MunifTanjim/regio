import { get, isNull, isNumber, keyBy, mapValues } from 'lodash-es'
import { parse } from 'query-string'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'
import { getClassTestMarks } from 'store/actions/teachers.js'
import { getAttendances, getEnrollments } from 'store/actions/terms.js'
import api from 'utils/api'

const getAttendanceMark = async (StudentId, TermId, CourseId) => {
  const { data, error } = await api(
    `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/marks/action/calculate-attendance-mark`
  )

  if (error) {
    console.error(error)
    return
  }

  return data.mark
}

function _MarksRow({
  ctNumbers,
  classTestMarks,
  StudentId,
  markIds,
  TermId,
  CourseId
}) {
  const [attendanceMark, setAttendanceMark] = useState(null)

  useEffect(() => {
    getAttendanceMark(StudentId, TermId, CourseId).then(mark =>
      setAttendanceMark(mark)
    )
  }, [CourseId, StudentId, TermId])

  const ctMarksByNumber = useMemo(() => {
    const marks = markIds.map(id => get(classTestMarks.items.byId, id))
    return mapValues(keyBy(marks, 'number'), 'mark')
  }, [markIds, classTestMarks])

  const data = useMemo(() => {
    const _data = { obtained: 0 }

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

    if (isNull(_data.obtained)) _data.obtained = ''

    return _data
  }, [ctNumbers, ctMarksByNumber])

  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      <Table.Cell textAlign="center">{attendanceMark}</Table.Cell>
      {ctNumbers.map(number => (
        <Table.Cell key={`td-ct${number}`} textAlign="center">
          {get(ctMarksByNumber, number)}
        </Table.Cell>
      ))}
      <Table.Cell textAlign="center">{data.obtained}</Table.Cell>
      <Table.Cell textAlign="center">{data.total}</Table.Cell>
    </Table.Row>
  )
}

const MarksRow = connect(({ marks }) => ({
  classTestMarks: marks.classtest
}))(memo(_MarksRow))

function MarksTable({
  StudentIds,
  classTestMarkIdsByStudent,
  ctNumbers,
  TermId,
  CourseId
}) {
  return (
    <Table celled basic compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Attendance</Table.HeaderCell>
          {ctNumbers.map(number => (
            <Table.HeaderCell key={`th-ct${number}`} textAlign="center">
              CT {number}
            </Table.HeaderCell>
          ))}
          <Table.HeaderCell textAlign="center">Obtained Marks</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Total Marks</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {StudentIds.map(StudentId => (
          <MarksRow
            key={StudentId}
            StudentId={StudentId}
            TermId={TermId}
            CourseId={CourseId}
            markIds={classTestMarkIdsByStudent[StudentId]}
            ctNumbers={ctNumbers}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

function ClassTestsReportForTeacher({
  TermId,
  section,
  CourseId,
  course,
  getCourse,
  attendances,
  getAttendances,
  classTestMarks,
  getClassTestMarks,
  enrollments,
  getEnrollments,
  location
}) {
  const TeacherId = useMemo(() => {
    return parse(location.search).TeacherId
  }, [location.search])

  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  useEffect(() => {
    getAttendances(TermId, CourseId)
    getEnrollments(TermId, CourseId)
  }, [CourseId, TermId, getAttendances, getEnrollments])

  useEffect(() => {
    getClassTestMarks(TeacherId, TermId, CourseId).then(x => console.log(x))
  }, [TermId, CourseId, TeacherId, getClassTestMarks])

  const enrollmentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    return enrollments.items.allIds.filter(id => regex.test(id))
  }, [CourseId, TermId, enrollments.items.allIds])

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
    console.log(course)
    if (course) {
      const maxNumber = Math.ceil(get(course, 'creditHr')) + 1
      for (let i = 0; i < maxNumber; i++) {
        numbers.push(String(i + 1))
      }
    }
    return numbers
  }, [course])

  return (
    <section className="sheet padding-10mm">
      <article>
        <MarksTable
          StudentIds={StudentIds}
          classTestMarkIdsByStudent={classTestMarkIdsByStudent}
          ctNumbers={ctNumbers}
          TermId={TermId}
          CourseId={CourseId}
        />
      </article>
    </section>
  )
}

const mapStateToProps = (
  { attendances, courses, enrollments, marks },
  { CourseId }
) => ({
  attendances,
  course: get(courses.items.byId, CourseId),
  classTestMarks: marks.classtest,
  enrollments
})

const mapDispatchToProps = {
  getCourse,
  getAttendances,
  getEnrollments,
  getClassTestMarks
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassTestsReportForTeacher)
