import { Router } from '@reach/router'
import Navbar from 'components/Navbar/Main.js'
import SidebarMenu from 'components/Sidebar/Menu.js'
import Dashboard from 'pages/Index.js'
import LogIn from 'pages/login/Main.js'
import Register from 'pages/register/Main.js'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Segment, Sidebar } from 'semantic-ui-react'
import { checkAuthStatus } from 'store/actions/currentUser.js'
import './styles/app.less'

function App({ checkAuthStatus, user: { status } }) {
  const [sidebarVisible, setSidebarVisible] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const toggleSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible)
  }, [sidebarVisible])

  return (
    <Sidebar.Pushable>
      {status.authed ? <SidebarMenu sidebarVisible={sidebarVisible} /> : null}

      <Sidebar.Pusher>
        <Navbar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
        <Segment basic padded>
          <Router>
            <Dashboard path="/*" />
            <LogIn path="/login" />
            <Register path="/register" />
          </Router>
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

const mapStateToProps = ({ user: { status } }) => ({ user: { status } })

const mapActionToProps = { checkAuthStatus }

export default connect(
  mapStateToProps,
  mapActionToProps
)(App)
