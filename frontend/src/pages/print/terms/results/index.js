import { get, isNull, sum, uniq, chunk } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Table, Container } from 'semantic-ui-react'
import {
  getTerm,
  getCoursesForTerm,
  getEnrollments,
  getResearchMarks,
  getSessionalMarks,
  getTermCourses,
  getTheoryMarks
} from 'store/actions/terms.js'
import calculateGrade from 'utils/calculate-grade'
import { getKV } from 'utils/kv'

import styles from './index.module.css'

const marksKeyByCourseType = {
  theory: 'theory',
  sessional: 'sessional',
  supervised: 'research'
}

function getGradeLetter(course, mark, isShort) {
  const courseType = get(course, 'type')

  const _data = {}

  if (courseType === 'theory') {
    _data.attendance = get(mark, 'attendance', null)
    _data.classTests = get(mark, 'classTests', null)
    _data.finalExamSectionA = get(mark, 'finalExamSectionA', null)
    _data.finalExamSectionB = get(mark, 'finalExamSectionB', null)

    const numbers = [
      _data.attendance,
      _data.classTests,
      _data.finalExamSectionA,
      _data.finalExamSectionB
    ]

    if (!numbers.some(isNull)) {
      _data.obtained = sum(numbers.map(Number))
    }
  } else if (courseType === 'sessional') {
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
  } else if (courseType === 'supervised') {
    _data.viva = get(mark, 'viva', null)
    _data.external = get(mark, 'external', null)
    _data.internal = get(mark, 'internal', null)

    const numbers = [_data.viva, _data.external, _data.internal]

    if (!numbers.some(isNull)) {
      _data.obtained = sum(numbers.map(Number))
    }
  }

  _data.total = Number(course.creditHr) * 100

  if (Number.isFinite(_data.obtained)) {
    const { point, letter } = calculateGrade(_data.obtained, _data.total, {
      isShort,
      isTheory: courseType !== 'sessional'
    })
    _data.gradePoint = point
    _data.gradeLetter = letter
  }

  return _data.gradeLetter
}

function _CourseCell({ course, mark, isShort }) {
  const gradeLetter = useMemo(() => getGradeLetter(course, mark, isShort), [
    course,
    isShort,
    mark
  ])

  return <Table.Cell>{gradeLetter}</Table.Cell>
}

const CourseCell = connect(
  ({ courses, enrollments, marks }, { TermId, CourseId, StudentId }) => {
    const courseType = get(courses.items.byId, [CourseId, 'type'])
    const markItems = get(marks, [marksKeyByCourseType[courseType], 'items'])

    return {
      course: get(courses.items.byId, CourseId),
      mark: get(markItems, ['byId', `${TermId}_${CourseId}_${StudentId}`]),
      isShort:
        get(enrollments.items.byId, [
          `${TermId}_${CourseId}_${StudentId}`,
          'type'
        ]) === 'short'
    }
  }
)(_CourseCell)

function Row({ TermId, StudentId, CourseIds }) {
  return (
    <Table.Row>
      <Table.Cell>{StudentId}</Table.Cell>
      {CourseIds.map(CourseId => (
        <CourseCell
          key={`CourseId-${CourseId}`}
          TermId={TermId}
          CourseId={CourseId}
          StudentId={StudentId}
        />
      ))}
      <Table.Cell>{StudentId}</Table.Cell>
    </Table.Row>
  )
}

function ClassTestsReportForTeacher({
  TermId,
  term,
  getTerm,
  courses,
  getCoursesForTerm,
  termcourses,
  getTermCourses,
  enrollments,
  getEnrollments,
  marks,
  getTheoryMarks,
  getSessionalMarks,
  getResearchMarks
}) {
  useEffect(() => {
    getTerm(TermId)
    getTermCourses(TermId)
    getCoursesForTerm(TermId)
  }, [TermId, getCoursesForTerm, getTerm, getTermCourses])

  const CourseIds = useMemo(() => {
    return get(termcourses.items.groupedIdsByTerm, TermId, [])
      .map(id => get(termcourses.items.byId, [id, 'CourseId']))
      .sort()
  }, [TermId, termcourses.items.byId, termcourses.items.groupedIdsByTerm])

  useEffect(() => {
    for (const CourseId of CourseIds) {
      getEnrollments(TermId, CourseId)

      const courseType = get(courses.items.byId, [CourseId, 'type'])
      if (courseType === 'theory') getTheoryMarks(TermId, CourseId)
      else if (courseType === 'sessional') getSessionalMarks(TermId, CourseId)
      else if (courseType === 'supervised') getResearchMarks(TermId, CourseId)
    }
  }, [
    CourseIds,
    TermId,
    term,
    courses.items.byId,
    getEnrollments,
    getResearchMarks,
    getSessionalMarks,
    getTheoryMarks
  ])

  const StudentIdChunks = useMemo(() => {
    return chunk(
      uniq(
        get(enrollments.items.groupedIdsByTerm, TermId, []).map(id =>
          get(enrollments.items.byId, [id, 'StudentId'])
        )
      ).sort(),
      30
    )
  }, [TermId, enrollments.items.byId, enrollments.items.groupedIdsByTerm])

  const [deptTitle, setDeptTitle] = useState('')
  useEffect(() => {
    getKV('departmentTitle').then(kv => setDeptTitle(kv.value))
  }, [])

  return (
    <>
      <Helmet>
        <style>{`html,body{font-size:12px;}`}</style>
      </Helmet>

      {StudentIdChunks.map((StudentIds, i) => (
        <section className="sheet padding-10mm" key={i}>
          <div className={styles.header}>
            Chittagong University of Engineering & Technology
            <br />
            {deptTitle}
            <br />
            Term {get(term, 'level')}-{get(term, 'term')} Session{' '}
            {get(term, 'SessionYearId')}
          </div>

          <Table celled textAlign="center" compact fixed striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Roll No.</Table.HeaderCell>
                {CourseIds.map(CourseId => (
                  <Table.HeaderCell key={`CourseId-${CourseId}`}>
                    {get(courses.items.byId, [CourseId, 'code'])}
                  </Table.HeaderCell>
                ))}
                <Table.HeaderCell>Roll No.</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {StudentIds.map(StudentId => (
                <Row
                  key={StudentId}
                  StudentId={StudentId}
                  TermId={TermId}
                  CourseIds={CourseIds}
                />
              ))}
            </Table.Body>
          </Table>
        </section>
      ))}
    </>
  )
}

const mapStateToProps = (
  { courses, enrollments, marks, terms, termcourses },
  { TermId }
) => ({
  courses,
  enrollments,
  marks,
  term: get(terms.items.byId, TermId),
  termcourses
})

const mapDispatchToProps = {
  getTerm,
  getCoursesForTerm,
  getTermCourses,
  getEnrollments,
  getTheoryMarks,
  getSessionalMarks,
  getResearchMarks
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassTestsReportForTeacher)
