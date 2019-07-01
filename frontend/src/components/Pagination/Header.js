import React from 'react'

import { Divider, Grid, Header, Loader, Segment } from 'semantic-ui-react'

function PaginationHeader({
  title,
  loading,
  actions,
  activeQueryBox,
  QueryBox
}) {
  return (
    <Segment padded>
      <Grid columns="2">
        <Grid.Column verticalAlign="middle" className="grow wide">
          <Header as="h2">{title}</Header>
        </Grid.Column>
        <Grid.Column className="auto wide">
          {loading ? (
            <Segment basic>
              <Loader active />
            </Segment>
          ) : (
            actions
          )}
        </Grid.Column>
      </Grid>
      {activeQueryBox && (
        <>
          <Divider hidden />
          {QueryBox}
        </>
      )}
    </Segment>
  )
}

export default PaginationHeader
