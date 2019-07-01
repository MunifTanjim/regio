import { Link } from '@reach/router'
import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dimmer,
  Grid,
  Header,
  Label,
  Loader,
  Segment
} from 'semantic-ui-react'
import getPersonName from '../../utils/get-person-name.js'
import Approve from './ActionModals/Approve.js'
import Delete from './ActionModals/Delete.js'

function StudentListItem({ data, id }) {
  return (
    <Segment>
      {data && data.User ? (
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column className="grow wide">
            {!data.User.approved && (
              <Label attached="top left" color="black">
                Unapproved
              </Label>
            )}
            <Header>
              {data.id}
              <Header.Subheader>
                {getPersonName(data.User.Person)}
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column className="auto wide">
            {!data.User.approved && (
              <>
                <Delete data={data} />
                <Approve data={data} />
              </>
            )}
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

const mapStateToProps = ({ students }, ownProps) => ({
  data: students.items.byId[ownProps.id]
})

export default connect(mapStateToProps)(StudentListItem)
