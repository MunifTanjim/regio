import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Grid, Header, Label, Loader, Segment } from 'semantic-ui-react'
import { getCourse } from '../../store/actions/courses.js'
import Delete from './ActionModals/Delete.js'

function ListItem({ data, id, getCourse }) {
  useEffect(() => {
    if (!data) getCourse(id)
  }, [data, getCourse, id])

  return (
    <Segment>
      {data ? (
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column className="grow wide">
            <Header>
              {get(data, 'title')}
              <Header.Subheader>
                {get(data, 'code')}
                <Label attached="top right">
                  {get(data, 'type', '').toUpperCase()}
                </Label>
              </Header.Subheader>
            </Header>
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

const mapStateToProps = ({ courses }, ownProps) => ({
  data: courses.items.byId[ownProps.id]
})

const mapDispatchToProps = {
  getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem)
