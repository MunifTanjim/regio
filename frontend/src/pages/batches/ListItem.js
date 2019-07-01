import { Link } from '@reach/router'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dimmer,
  Grid,
  Header,
  Loader,
  Segment
} from 'semantic-ui-react'
import { getBatch } from 'store/actions/batches.js'
import getPersonName from 'utils/get-person-name.js'
import Delete from './ActionModals/Delete.js'
import Edit from './ActionModals/Edit.js'

function ListItem({ data, id, getBatch, coordinator }) {
  useEffect(() => {
    if (!data) getBatch(id)
  }, [data, getBatch, id])

  return (
    <Segment>
      {data ? (
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column className="grow wide">
            <Header>
              Batch {get(data, 'id')}
              <Header.Subheader>
                Co-ordinator: {getPersonName(get(coordinator, 'User.Person'))}
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column className="auto wide">
            <Delete data={data} />
            <Edit BatchId={id} data={data} />
            <Button as={Link} to={`${get(data, 'id')}`}>
              Open
            </Button>
          </Grid.Column>
        </Grid>
      ) : (
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      )}
    </Segment>
  )
}

const mapStateToProps = ({ batches, teachers }, { id }) => ({
  data: get(batches.items.byId, id),
  coordinator: get(
    teachers.items.byId,
    get(batches.items.byId, [id, 'coordinatorId'])
  )
})

const mapDispatchToProps = {
  getBatch
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem)
