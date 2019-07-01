import { Redirect } from '@reach/router'
import PrintPage from 'pages/print/Main.js'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { checkAuthStatus } from 'store/actions/currentUser.js'
import './styles/print.less'

function Print({ checkAuthStatus, user: { data, status }, ...props }) {
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return status.loading ? (
    <div>Loading...</div>
  ) : status.authed ? (
    <PrintPage user={data} {...props} />
  ) : (
    <Redirect to="/login" noThrow />
  )
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapActionToProps = { checkAuthStatus }

export default connect(
  mapStateToProps,
  mapActionToProps
)(Print)
