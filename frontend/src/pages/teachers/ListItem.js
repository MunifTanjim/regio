import { Link } from '@reach/router'
import React, { useEffect } from 'react'
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
import { getTeacher } from 'store/actions/teachers.js'
import getPersonName from 'utils/get-person-name.js'
import Approve from './ActionModals/Approve.js'
import Delete from './ActionModals/Delete.js'

function ListItem({ data, id, getTeacher }) {
  useEffect(() => {
    if (!data) getTeacher(id)
  }, [data, getTeacher, id])

  return (
    <Segment>
      {data ? (
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column className="grow wide">
            {!data.User.approved && (
              <Label attached="top left" color="black">
                Unapproved
              </Label>
            )}
            <Header>
              {getPersonName(data.User.Person)}
              <Header.Subheader>ID: {data.id}</Header.Subheader>
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

const mapStateToProps = ({ teachers }, ownProps) => ({
  data: teachers.items.byId[ownProps.id]
})

const mapDispatchToProps = {
  getTeacher
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem)
