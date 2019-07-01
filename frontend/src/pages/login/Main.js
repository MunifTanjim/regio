import { Redirect } from '@reach/router'
import React from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Image } from 'semantic-ui-react'
import { logIn } from 'store/actions/currentUser.js'
import Logo from '../../logo.svg'
import Form from './Form.js'

function LogIn({ user: { status }, logIn }) {
  return status.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Grid columns={1} centered padded>
      <Grid.Column
        mobile={16}
        tablet={12}
        computer={8}
        style={{ maxWidth: '512px' }}
      >
        <Header as="h2" textAlign="center">
          <Image src={Logo} alt="Logo" ui /> Log In
        </Header>
        <Form logIn={logIn} />
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = { logIn }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogIn)
