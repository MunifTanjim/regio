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
import { getTerm } from 'store/actions/terms.js'

function ListItem({ data, id, getTerm }) {
  useEffect(() => {
    if (!data) getTerm(id)
  }, [data, getTerm, id])

  return (
    <Segment>
      {data ? (
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column className="grow wide">
            <Header>
              <Header.Subheader>
                Session {get(data, 'SessionYearId')}
              </Header.Subheader>
              Term {get(data, 'level')}-{get(data, 'term')} [Batch{' '}
              {get(data, 'BatchId')}]
            </Header>
          </Grid.Column>
          <Grid.Column className="auto wide">
            <Button as={Link} to={`${id}`}>
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

const mapStateToProps = ({ terms }, ownProps) => ({
  data: terms.items.byId[ownProps.id]
})

const mapDispatchToProps = {
  getTerm
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem)
