import Permit from 'components/Permit.js'
import { get, map } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Segment, Table } from 'semantic-ui-react'
import { getEnrollments } from 'store/actions/students.js'
import { getTerm } from 'store/actions/terms.js'
import Approve from './ActionModals/Approve.js'
import Item from './ListItem.js'

function StudentTermEnrollmentList({
  StudentId,
  TermId,
  enrollments,
  term,
  getEnrollments,
  getTerm
}) {
  useEffect(() => {
    getEnrollments(StudentId, { query: `filter=TermId==${TermId}` })
  }, [StudentId, TermId, getEnrollments])

  useEffect(() => {
    if (!term) getTerm(TermId)
  }, [TermId, getTerm, term])

  return (
    <Permit sysadmin head teacher UserId={StudentId}>
      <Segment>
        <Grid>
          <Grid.Column className="grow wide">
            {term && (
              <Header>
                Level {term.level} Term {term.term} Enrollments
                <Header.Subheader>
                  Session {term.SessionYearId}
                </Header.Subheader>
              </Header>
            )}
          </Grid.Column>
          <Grid.Column className="auto wide">
            <Permit sysadmin>
              <Approve
                StudentId={StudentId}
                TermId={TermId}
                enrollments={enrollments}
              />
            </Permit>
          </Grid.Column>
        </Grid>
      </Segment>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Credit Hr</Table.HeaderCell>
            <Table.HeaderCell collapsing>Approved</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {enrollments.map(({ id, CourseId, approved }) => (
            <Item key={id} CourseId={CourseId} approved={approved} />
          ))}
        </Table.Body>
      </Table>
    </Permit>
  )
}

const mapStateToProps = ({ enrollments, terms }, { StudentId, TermId }) => {
  const _term = get(terms.items.byId, TermId)

  const _enrollmentIds = get(
    enrollments.items.groupedIds,
    [StudentId, TermId],
    []
  )

  const _enrollments = map(_enrollmentIds, id =>
    get(enrollments.items.byId, id, {})
  )

  return {
    enrollments: _enrollments,
    term: _term
  }
}

const mapDispatchToProps = {
  getEnrollments,
  getTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentTermEnrollmentList)
