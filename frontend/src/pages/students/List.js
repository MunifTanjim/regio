import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import { get, orderBy, zipObject } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Header, Segment, Button } from 'semantic-ui-react'
import { fetchAllBatchesPage } from 'store/actions/batches.js'
import { fetchAllStudentsPage } from 'store/actions/students.js'
import formatDropdownOptions from 'utils/format-dropdown-options.js'
import ListItem from './ListItem.js'
import { Link } from '@reach/router'

function StudentList({
  batches,
  fetchAllBatchesPage,
  students,
  fetchAllStudentsPage
}) {
  useEffect(() => {
    fetchAllBatchesPage({ query: `length=20` })
  }, [fetchAllBatchesPage])

  const batchOptions = useMemo(() => {
    return orderBy(
      formatDropdownOptions(
        zipObject(batches.items.allIds, batches.items.allIds)
      ),
      ['value'],
      ['desc']
    )
  }, [batches.items.allIds])

  const [batch, setBatch] = useState('')

  useEffect(() => {
    const batchId = get(batchOptions, '[0].value')
    if (batchId) setBatch(batchId)
  }, [batchOptions])

  const onBatchChange = useCallback((_, { value }) => {
    if (value) setBatch(value)
  }, [])

  useEffect(() => {
    if (batch) {
      fetchAllStudentsPage({ query: `length=120&filter=BatchId==${batch}` })
    }
  }, [batch, fetchAllStudentsPage])

  const StudentIds = useMemo(() => {
    const BatchId = Number(batch)

    const StudentIds = students.items.allIds
      .filter(id => get(students.items.byId, [id, 'BatchId']) === BatchId)
      .sort()

    return StudentIds
  }, [batch, students.items.allIds, students.items.byId])

  return (
    <Permit sysadmin head teacher>
      <Segment>
        <HeaderGrid
          Left={<Header>Students</Header>}
          Right={
            <>
              <Dropdown
                selection
                search
                value={batch}
                options={batchOptions}
                onChange={onBatchChange}
              />
              <Permit sysadmin>
                {' '}
                <Button as={Link} to={`create`}>
                  Create
                </Button>
              </Permit>
            </>
          }
        />
      </Segment>

      {StudentIds.map(StudentId => (
        <ListItem key={StudentId} id={StudentId} />
      ))}
    </Permit>
  )
}

const mapStateToProps = ({ batches, students }) => ({
  batches,
  students
})

const mapDispatchToProps = {
  fetchAllStudentsPage,
  fetchAllBatchesPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentList)
