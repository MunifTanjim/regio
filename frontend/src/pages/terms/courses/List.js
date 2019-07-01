import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import { get, sortBy } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Statistic, Table } from 'semantic-ui-react'
import { getTermCourses } from 'store/actions/terms.js'
import SetCourses from './ActionModals/SetCourses.js'
import TermCourseCells from './view/TermCourseCells.js'

function TermCourseList({ TermId, termcourses, getTermCourses, linkToBase }) {
  useEffect(() => {
    getTermCourses(TermId)
  }, [TermId, getTermCourses])

  const termcoursesForTerm = useMemo(() => {
    return sortBy(
      get(termcourses.items.groupedIdsByTerm, TermId, []).map(id =>
        get(termcourses.items.byId, id)
      ),
      'CourseId'
    )
  }, [TermId, termcourses.items.byId, termcourses.items.groupedIdsByTerm])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Courses</Header>}
          Right={<SetCourses TermId={TermId} />}
        />
      </Segment>

      <Segment>
        <>
          <Statistic.Group size="mini" widths={2} style={{ padding: '1em 0' }}>
            <Statistic>
              <Statistic.Value>
                {get(termcoursesForTerm, `[0].startDate`) || '...'}
              </Statistic.Value>
              <Statistic.Label>Start Date</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>
                {get(termcoursesForTerm, `[0].endDate`) || '...'}
              </Statistic.Value>
              <Statistic.Label>End Date</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <Table basic celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Credit Hour</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {termcoursesForTerm.map(({ id, CourseId }) => (
                <Table.Row key={id}>
                  <TermCourseCells CourseId={CourseId} />
                  <Table.Cell>
                    <Button
                      as={Link}
                      to={`${linkToBase}${CourseId}`}
                      icon="chevron right"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      </Segment>
    </>
  )
}

const mapStateToProps = ({ terms, termcourses }, { TermId }) => ({
  term: get(terms.items.byId, TermId),
  termcourses
})

const mapDispatchToProps = {
  getTermCourses
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermCourseList)
