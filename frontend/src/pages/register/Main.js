import { Redirect } from '@reach/router'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Grid, Header, Image, Message } from 'semantic-ui-react'
import Logo from '../../logo.svg'
import Form from './Form.js'

function Register({ user: { status } }) {
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState(null)

  const handleSuccess = useCallback(data => {
    setSuccess(true)
    setData(data)
  }, [])

  return status.authed ? (
    <Redirect to="/" noThrow />
  ) : (
    <Grid columns={1} centered padded>
      <Grid.Column mobile={16} tablet={12} style={{ maxWidth: '840px' }}>
        <Header as="h2" textAlign="center">
          <Image src={Logo} alt="Logo" ui /> Register
        </Header>

        {success && data ? (
          <Message
            positive
            header={`Hello ${
              data.User.Person.firstName
            }, You are Successfully Registered!`}
            content={`You'll be able to Log In once your account is approved!`}
          />
        ) : (
          <Form handleSuccess={handleSuccess} />
        )}
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(Register)
