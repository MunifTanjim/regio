import { get, map, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import {
  fetchAllStudentsPage,
  setAdviser
} from '../../store/actions/students.js'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import HeaderGrid from 'components/HeaderGrid.js'
import { Header, Segment, Table, Dropdown, Button } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import Permit from 'components/Permit.js'

const AdviserViewer = connect(({ students, teachers }, { StudentId }) => ({
  adviser: get(
    teachers.items.byId,
    get(students.items.byId, [StudentId, 'adviserId'])
  )
}))(({ adviser }) => getPersonName(get(adviser, `User.Person`)) || 'N/A')

function _AdviserUpdater({ StudentId, adviserId, teacherOptions, setAdviser }) {
  const [loading, setLoading] = useState(false)

  const onChange = useCallback(
    async (_, { value }) => {
      setLoading(true)
      await setAdviser(StudentId, { TeacherId: value })
      setLoading(false)
    },
    [StudentId, setAdviser]
  )

  return (
    <Dropdown
      selection
      search
      defaultValue={adviserId}
      options={teacherOptions}
      onChange={onChange}
      disabled={loading}
      loading={loading}
    />
  )
}

const AdviserUpdater = connect(
  ({ students }, { StudentId }) => ({
    adviserId: String(get(students.items.byId, [StudentId, 'adviserId'])) || ''
  }),
  { setAdviser }
)(_AdviserUpdater)

function BatchView({
  BatchId,
  students,
  fetchAllStudentsPage,
  teachers,
  fetchAllTeachersPage
}) {
  useEffect(() => {
    fetchAllTeachersPage({ query: `length=25` })
  }, [fetchAllTeachersPage])

  useEffect(() => {
    fetchAllStudentsPage({ query: `length=120&filter=BatchId==${BatchId}` })
  }, [BatchId, fetchAllStudentsPage])

  const StudentIds = useMemo(() => {
    const _BatchId = Number(BatchId)
    return students.items.allIds
      .filter(id => get(students.items.byId, [id, 'BatchId']) === _BatchId)
      .sort()
  }, [BatchId, students.items.allIds, students.items.byId])

  const [updatingAdviser, setUpdatingAdviser] = useState(false)

  const teacherOptions = useMemo(() => {
    return formatDropdownOptions(
      zipObject(
        teachers.items.allIds,
        map(teachers.items.allIds, id =>
          getPersonName(get(teachers.items.byId, [id, 'User', 'Person']))
        )
      )
    )
  }, [teachers.items])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={<Header>Batch {BatchId}</Header>}
          Right={
            <Permit sysadmin head>
              <Button
                type="button"
                color={updatingAdviser ? 'green' : 'blue'}
                content={`${updatingAdviser ? 'Save' : 'Update'} Advisers`}
                onClick={() => setUpdatingAdviser(s => !s)}
              />
            </Permit>
          }
        />
      </Segment>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Adviser</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {StudentIds.map(StudentId => (
            <Table.Row key={StudentId}>
              <Table.Cell collapsing>{StudentId}</Table.Cell>
              <Table.Cell>
                {getPersonName(
                  get(students.items.byId, [StudentId, 'User', 'Person'])
                )}
              </Table.Cell>
              <Table.Cell>
                {updatingAdviser ? (
                  <AdviserUpdater
                    StudentId={StudentId}
                    teacherOptions={teacherOptions}
                  />
                ) : (
                  <AdviserViewer StudentId={StudentId} />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
const mapStateToProps = ({ students, teachers }) => ({
  students,
  teachers
})

const mapDispatchToProps = {
  fetchAllStudentsPage,
  fetchAllTeachersPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchView)
