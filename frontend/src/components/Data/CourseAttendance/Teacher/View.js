import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { chunk, get, keyBy, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Segment,
  Table
} from 'semantic-ui-react'
import formatDropdownOptions from 'utils/format-dropdown-options'

const dateChunkSize = 5

const emptyArray = []

function TeacherCourseAttendanceView({
  TeacherId,
  TermId,
  CourseId,
  attendances,
  enrollments,
  sections = emptyArray
}) {
  const [section, setSection] = useState()

  useEffect(() => {
    setSection(sections[0])
  }, [sections])

  const StudentIds = useMemo(() => {
    const regex = RegExp(`^${TermId}_${CourseId}_`)

    const enrollmentIds = enrollments.items.allIds
      .filter(id => regex.test(id))
      .filter(id => get(enrollments.items.byId, [id, 'section']) === section)

    return enrollmentIds
      .map(id => get(enrollments.items.byId, [id, 'StudentId']))
      .sort()
  }, [
    TermId,
    CourseId,
    enrollments.items.allIds,
    enrollments.items.byId,
    section
  ])

  const data = useMemo(() => {
    const data = {
      StudentIds
    }

    const regex = RegExp(`^${TermId}_${CourseId}_.+_${section}$`)

    const byDate = keyBy(
      attendances.items.allIds
        .filter(id => regex.test(id))
        .sort()
        .map(id => get(attendances.items.byId, id)),
      'date'
    )

    data.dateChunks = chunk(Object.keys(byDate).reverse(), dateChunkSize)
    data.totalDateChunks = data.dateChunks.length

    data.byStudentIds = StudentIds.reduce((byIds, id) => {
      byIds[id] = data.dateChunks.map(dateChunk => {
        return dateChunk.map(date =>
          get(byDate, [date, 'StudentIds']).includes(id)
        )
      })
      return byIds
    }, {})

    return data
  }, [
    CourseId,
    StudentIds,
    TermId,
    attendances.items.allIds,
    attendances.items.byId,
    section
  ])

  const [currentChunk, setCurrentChunk] = useState(0)

  const previousChunk = useCallback(() => {
    setCurrentChunk(chunk => (chunk > 0 ? chunk - 1 : chunk))
  }, [])

  const nextChunk = useCallback(() => {
    setCurrentChunk(chunk =>
      chunk + 1 < data.totalDateChunks ? chunk + 1 : chunk
    )
  }, [data.totalDateChunks])

  const sectionOptions = useMemo(() => {
    return formatDropdownOptions(zipObject(sections, sections))
  }, [sections])

  return (
    <Permit sysadmin head UserId={`T${TeacherId}`}>
      <Segment>
        <HeaderGrid
          Left={<Header>Attendance</Header>}
          Right={
            <Dropdown
              selection
              compact
              value={section}
              options={sectionOptions}
              onChange={(_, { value }) => {
                setSection(value)
              }}
            />
          }
        />
      </Segment>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Button
                type="button"
                icon="chevron left"
                onClick={previousChunk}
                disabled={currentChunk === 0}
              />
              <Button
                type="button"
                icon="chevron right"
                onClick={nextChunk}
                disabled={currentChunk + 1 >= data.totalDateChunks}
              />
            </Table.HeaderCell>
            {data.totalDateChunks ? (
              <>
                {data.dateChunks[currentChunk].map(date => (
                  <Table.HeaderCell key={date} collapsing textAlign="center">
                    <span>{date.slice(5)}</span>
                  </Table.HeaderCell>
                ))}
              </>
            ) : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.StudentIds.map(StudentId => (
            <Table.Row key={StudentId}>
              <Table.Cell>{StudentId}</Table.Cell>

              {data.totalDateChunks ? (
                <>
                  {data.byStudentIds[StudentId][currentChunk].map(
                    (isPresent, i) => (
                      <Table.Cell key={i} collapsing textAlign="center">
                        {isPresent ? <Icon name="check" /> : <Icon name="x" />}
                      </Table.Cell>
                    )
                  )}
                </>
              ) : null}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="100%" textAlign="right">
              <Button
                type="button"
                icon="chevron left"
                onClick={previousChunk}
                disabled={currentChunk === 0}
              />
              <Button
                type="button"
                icon="chevron right"
                onClick={nextChunk}
                disabled={currentChunk + 1 >= data.totalDateChunks}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Permit>
  )
}

const mapStateToProps = (
  { attendances, enrollments, termcourses },
  { TermId, CourseId, TeacherId }
) => ({
  attendances,
  enrollments,
  sections: get(termcourses.sectionsByTeacherId, [
    `${TermId}_${CourseId}`,
    TeacherId
  ])
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherCourseAttendanceView)
