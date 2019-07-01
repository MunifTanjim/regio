import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { defaultsDeep, get, groupBy, map, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import { getBatch } from 'store/actions/batches.js'
import {
  getAllRoutinesForTerm,
  getAllSlots,
  getAllWeekPlansForTerm
} from 'store/actions/routines.js'
import { getCoursesForTerm } from 'store/actions/terms.js'
import PrintButtonTeleport from 'components/Navbar/PrintButtonTeleport.js'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU']
const breakLetterByDays = ['B', 'R', 'E', 'A', 'K']
const reservedSlotIds = [1, 4, 8]
const weekNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

function RoutineTermSectionsView({
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
  getBatch
}) {
  useEffect(() => {
    if (get(term, 'BatchId') && !batch) getBatch(get(term, 'BatchId'))
  }, [batch, getBatch, term])

  useEffect(() => {
    getAllSlots({ query: `sort=startTime` })
  }, [getAllSlots])

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

  return (
    <>
      <Segment>
        <PrintButtonTeleport.Source>
          <Button
            icon="print"
            as={'a'}
            target="_blank"
            href={`/print/routines/terms/${TermId}/section/${section}`}
          />
        </PrintButtonTeleport.Source>

        <HeaderGrid
          Left={<Header>Routine for Section {section}</Header>}
          Right={
            <Permit sysadmin UserId={`T${get(batch, 'coordinatorId')}`}>
              <Button as={Link} to={`edit`}>
                Edit
              </Button>
            </Permit>
          }
        />
      </Segment>

      <Table celled textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing />
            {routines.slotItems.allIds.map(slotId => (
              <Table.HeaderCell key={slotId}>
                {get(routines.slotItems.byId, [slotId, 'startTime'], '').slice(
                  0,
                  -3
                )}
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
              <Table.Cell collapsing>
                <strong>{day}</strong>
              </Table.Cell>
              {routines.slotItems.allIds.map(slotId => {
                const { disabled, text } = getClassData(day, slotId)
                return (
                  <Table.Cell
                    key={`${day}-${slotId}`}
                    collapsing
                    selectable
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

      <Segment>
        <HeaderGrid
          Left={<Header>CT Schedule for Section {section}</Header>}
          Right={
            <Permit sysadmin UserId={`T${get(batch, 'coordinatorId')}`}>
              <Button as={Link} to={`edit-weekplan`}>
                Edit
              </Button>
            </Permit>
          }
        />
      </Segment>

      <Table celled textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing />
            {weekNumbers.map(weekNumber => (
              <Table.HeaderCell key={weekNumber} collapsing>
                {String(weekNumber).padStart(2, '0')}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(weekPlanValues).map(([day, byWeekNumber]) => (
            <Table.Row key={day}>
              <Table.Cell collapsing>
                <strong>{day}</strong>
              </Table.Cell>
              {Object.entries(byWeekNumber).map(([weekNumber, note]) => {
                return (
                  <Table.Cell
                    key={`${day}-${weekNumber}`}
                    collapsing
                    selectable
                  >
                    {note}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

const mapStateToProps = (
  { courses, routines, terms, batches },
  { TermId }
) => ({
  courses,
  routines,
  term: get(terms.items.byId, TermId),
  batch: get(batches.items.byId, get(terms.items.byId, [TermId, 'BatchId']))
})

const mapDispatchToProps = {
  getAllRoutinesForTerm,
  getCoursesForTerm,
  getAllSlots,
  getAllWeekPlansForTerm,
  getBatch
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineTermSectionsView)
