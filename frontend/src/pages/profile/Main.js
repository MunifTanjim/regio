import { Link, Router, Match } from '@reach/router'
import ContactInfo from 'components/ContactInfo/Main.js'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit.js'
import StudentTerms from 'components/Student/Terms/Main.js'
import TeacherTerms from 'components/Teacher/Terms/Main.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Divider } from 'semantic-ui-react'
import getPersonName from 'utils/get-person-name.js'
import ChangePassword from './ChangePassword.js'

function View({ data, uri }) {
  return data ? (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              {getPersonName(get(data, 'User.Person'))}
              <Header.Subheader>ID: {get(data, 'User.id')}</Header.Subheader>
            </Header>
          }
          Right={
            <Button as={Link} to={`change-password`}>
              Change Password
            </Button>
          }
        />

        <Match path={uri}>
          {props =>
            props.match ? (
              <>
                <Divider />
                <ContactInfo />
              </>
            ) : null
          }
        </Match>
      </Segment>

      <Router>
        <ChangePassword path="change-password" />
      </Router>

      <Permit student>
        <StudentTerms StudentId={get(data, 'id')} />
      </Permit>

      <Permit teacher>
        <TeacherTerms TeacherId={get(data, 'id')} />
      </Permit>
    </>
  ) : null
}

const mapStateToProps = ({ user }) => ({
  data: user.data
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
