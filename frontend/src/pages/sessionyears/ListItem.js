import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Grid, Header, Loader, Segment } from 'semantic-ui-react'
import { getSessionYear } from 'store/actions/sessionyears.js'
import Delete from './ActionModals/Delete.js'

function ListItem({ data, id, getSessionYear }) {
  useEffect(() => {
    if (!data) getSessionYear(id)
  }, [data, getSessionYear, id])

  return (
    <Segment>
      {data ? (
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column className="grow wide">
            <Header>Session {get(data, 'id')}</Header>
          </Grid.Column>
          <Grid.Column className="auto wide">
            <Delete data={data} />
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

const mapStateToProps = ({ sessionyears }, { id }) => ({
  data: get(sessionyears.items.byId, id)
})

const mapDispatchToProps = {
  getSessionYear
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem)
