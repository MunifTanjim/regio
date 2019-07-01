import './Main.css'

import React from 'react'
import { Link } from '@reach/router'

import { connect } from 'react-redux'
import { logOut } from '../../store/actions/currentUser.js'

import { Button, Menu } from 'semantic-ui-react'

import PrintButtonTeleport from './PrintButtonTeleport.js'

function Navbar({ user: { status }, sidebarVisible, toggleSidebar, logOut }) {
  return (
    <Menu borderless className="regio navbar">
      {status.authed ? (
        <Menu.Item className="mobile only">
          <Button
            type="button"
            icon="sidebar"
            active={sidebarVisible}
            onClick={toggleSidebar}
          />
        </Menu.Item>
      ) : null}

      <Menu.Item as={PrintButtonTeleport.Target} />

      <Menu.Menu position="right">
        {!status.loading && !status.authed ? (
          <Menu.Item>
            <Button as={Link} to="/login">
              Log In
            </Button>
          </Menu.Item>
        ) : null}

        {status.authed ? (
          <Menu.Item>
            <Button onClick={logOut}>Log Out</Button>
          </Menu.Item>
        ) : null}
      </Menu.Menu>
    </Menu>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const mapActionToProps = { logOut }

export default connect(
  mapStateToProps,
  mapActionToProps
)(Navbar)
