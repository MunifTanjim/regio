import { defaultsDeep, get, groupBy, map, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { getBatch } from 'store/actions/batches.js'
import { getCourse } from 'store/actions/courses.js'
import {
  getAllRoutinesForTerm,
  getAllSlots,
  getAllWeekPlansForTerm
} from 'store/actions/routines.js'
import {
  getCoursesForTerm,
  getTermCourses,
  getTermCourseTeachers
} from 'store/actions/terms.js'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import getPersonName from 'utils/get-person-name'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU']
const breakLetterByDays = ['B', 'R', 'E', 'A', 'K']
const reservedSlotIds = [1, 4, 8]
const weekNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

function _TermCourseCells({
  CourseId,
  course,
  getCourse,
  teachers,
  teacherIds
}) {
  useEffect(() => {
    if (!course) getCourse(CourseId)
  }, [CourseId, course, getCourse])

  return (
    <>
      <Table.Cell style={{ whiteSpace: 'nowrap' }}>
        {get(course, 'code', '')}
      </Table.Cell>
      <Table.Cell textAlign="left">{get(course, 'title', '')}</Table.Cell>
      <Table.Cell style={{ whiteSpace: 'nowrap' }}>
        {get(course, 'creditHr', '')}
      </Table.Cell>
      <Table.Cell>
        {teacherIds
          .map(teacherId =>
            getPersonName(
              get(teachers.items.byId, [teacherId, 'User', 'Person'])
            )
          )
          .join(', ')}
      </Table.Cell>
    </>
  )
}

const TermCourseCells = connect(
  ({ courses, teachers, termcourses }, { TermId, CourseId, section }) => ({
    course: courses.items.byId[CourseId],
    teachers,
    teacherIds: get(
      termcourses.teacherIdsBySection,
      [`${TermId}_${CourseId}`, section],
      []
    )
  }),
  { getCourse }
)(_TermCourseCells)

function ClassTestsReportForTeacher({
  TermId,
  section,
  courses,
  getCoursesForTerm,
  routines,
  getAllRoutinesForTerm,
  getAllSlots,
  getAllWeekPlansForTerm,
  term,
  batch,
  getBatch,
  termcourses,
  getTermCourses,
  getTermCourseTeachers,
  fetchAllTeachersPage
}) {
  useEffect(() => {
    if (get(term, 'BatchId') && !batch) getBatch(get(term, 'BatchId'))
  }, [batch, getBatch, term])

  useEffect(() => {
    getAllSlots({ query: `sort=startTime` })
    fetchAllTeachersPage()
  }, [fetchAllTeachersPage, getAllSlots])

  useEffect(() => {
    getTermCourses(TermId)
    getTermCourseTeachers(TermId)
  }, [TermId, getTermCourseTeachers, getTermCourses])

  useEffect(() => {
    getAllRoutinesForTerm(TermId, { query: `filter=section==${section}` })
    getAllWeekPlansForTerm(TermId, { query: `filter=section==${section}` })
  }, [TermId, getAllRoutinesForTerm, getAllWeekPlansForTerm, section])

  const routineStub = useMemo(() => {
    const dayStub = zipObject(
      routines.slotItems.allIds,
      routines.slotItems.allIds.map(() => null)
    )
    const stub = zipObject(days, days.map(() => dayStub))
    return stub
  }, [routines.slotItems.allIds])

  const weekPlanStub = useMemo(() => {
    const dayStub = zipObject(weekNumbers, map(weekNumbers, () => ''))
    return zipObject(days, map(days, () => dayStub))
  }, [])

  useEffect(() => {
    getCoursesForTerm(TermId)
  }, [TermId, getCoursesForTerm])

  const values = useMemo(() => {
    const regex = RegExp(`^${TermId}_${section}_`)
    const routineIds = get(routines.items.groupedIdsByTerm, TermId, []).filter(
      id => regex.test(id)
    )

    const data = {}
    const items = routineIds.map(id => get(routines.items.byId, id))
    const byDay = groupBy(items, 'day')

    for (const [day, dayItems] of Object.entries(byDay)) {
      data[day] = dayItems.reduce((dayData, item) => {
        item.RoutineSlotIds.forEach(slotId => {
          dayData[slotId] = item.CourseId
        })
        return dayData
      }, {})
    }

    return defaultsDeep(data, routineStub)
  }, [
    TermId,
    routineStub,
    routines.items.byId,
    routines.items.groupedIdsByTerm,
    section
  ])

  const getClassData = useCallback(
    (day, slotId) => {
      const classData = {
        disabled: reservedSlotIds.includes(slotId),
        text: ''
      }

      if (classData.disabled) {
        classData.text =
          slotId === 1 ? 'CT' : breakLetterByDays[days.indexOf(day)]
      } else {
        classData.text = get(courses.items.byId, [
          get(values, [day, slotId]),
          'code'
        ])
      }

      return classData
    },
    [courses.items.byId, values]
  )

  const weekPlanValues = useMemo(() => {
    const regex = RegExp(`^${TermId}_${section}_`)
    const weekPlanIds = get(
      routines.weekPlanItems.groupedIdsByTerm,
      TermId,
      []
    ).filter(id => regex.test(id))

    const data = {}
    const items = weekPlanIds.map(id => get(routines.weekPlanItems.byId, id))
    const byDay = groupBy(items, 'day')

    for (const [day, dayItems] of Object.entries(byDay)) {
      data[day] = dayItems.reduce((dayData, item) => {
        dayData[item.weekNumber] = item.note
        return dayData
      }, {})
    }

    return defaultsDeep(data, weekPlanStub)
  }, [
    TermId,
    routines.weekPlanItems.byId,
    routines.weekPlanItems.groupedIdsByTerm,
    section,
    weekPlanStub
  ])

  const termcoursesForTerm = useMemo(() => {
    return get(termcourses.items.groupedIdsByTerm, TermId, []).map(
      id => termcourses.items.byId[id]
    )
  }, [TermId, termcourses.items.byId, termcourses.items.groupedIdsByTerm])

  return (
    <section className="sheet padding-10mm">
      <article>
        <Table celled textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              {routines.slotItems.allIds.map(slotId => (
                <Table.HeaderCell key={slotId}>
                  {get(
                    routines.slotItems.byId,
                    [slotId, 'startTime'],
                    ''
                  ).slice(0, -3)}
                  <br />
                  &mdash;
                  <br />
                  {get(routines.slotItems.byId, [slotId, 'endTime'], '').slice(
                    0,
                    -3
                  )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {days.map(day => (
              <Table.Row key={day}>
                <Table.Cell>
                  <strong>{day}</strong>
                </Table.Cell>
                {routines.slotItems.allIds.map(slotId => {
                  const { disabled, text } = getClassData(day, slotId)
                  return (
                    <Table.Cell
                      key={`${day}-${slotId}`}
                      disabled={disabled}
                      className={disabled ? 'static' : ''}
                    >
                      {text}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Table celled compact textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ whiteSpace: 'nowrap' }} width={2}>
                Course No.
              </Table.HeaderCell>
              <Table.HeaderCell width={6}>Course Title</Table.HeaderCell>
              <Table.HeaderCell style={{ whiteSpace: 'nowrap' }} width={2}>
                Total Credit
              </Table.HeaderCell>
              <Table.HeaderCell width={6}>
                Name of the Teachers
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {termcoursesForTerm.map(({ id, CourseId }) => (
              <Table.Row key={id}>
                <TermCourseCells
                  TermId={TermId}
                  CourseId={CourseId}
                  section={section}
                />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Table celled textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              {weekNumbers.map(weekNumber => (
                <Table.HeaderCell key={weekNumber}>
                  {String(weekNumber).padStart(2, '0')}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(weekPlanValues).map(([day, byWeekNumber]) => (
              <Table.Row key={day}>
                <Table.Cell>
                  <strong>{day}</strong>
                </Table.Cell>
                {Object.entries(byWeekNumber).map(([weekNumber, note]) => {
                  return (
                    <Table.Cell key={`${day}-${weekNumber}`}>{note}</Table.Cell>
                  )
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </article>
    </section>
  )
}

const mapStateToProps = (
  { courses, routines, terms, termcourses, batches },
  { TermId }
) => ({
  courses,
  routines,
  term: get(terms.items.byId, TermId),
  batch: get(batches.items.byId, get(terms.items.byId, [TermId, 'BatchId'])),
  termcourses
})

const mapDispatchToProps = {
  getAllRoutinesForTerm,
  getCoursesForTerm,
  getAllSlots,
  getAllWeekPlansForTerm,
  getBatch,
  getTermCourses,
  getTermCourseTeachers,
  fetchAllTeachersPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassTestsReportForTeacher)
