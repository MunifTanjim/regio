import { Redirect, Router } from '@reach/router'
import React from 'react'
import { connect } from 'react-redux'
import Batches from './batches/Main.js'
import Courses from './courses/Main.js'
import Profile from './profile/Main.js'
import Routines from './routines/Main.js'
import SessionYears from './sessionyears/Main.js'
import Students from './students/Main.js'
import Teachers from './teachers/Main.js'
import Terms from './terms/Main.js'
import KVs from './kv/Main.js'

function Dashboard({ user: { status } }) {
  return status.loading ? (
    <div>Loading...</div>
  ) : status.authed ? (
    <Router>
      <Profile path="profile/*" />
      <Batches path="batches/*" />
      <SessionYears path="sessionyears/*" />
      <Terms path="terms/*" />
      <Courses path="courses/*" />
      <Students path="students/*" />
      <Teachers path="teachers/*" />
      <Routines path="routines/*" />
      <KVs path="kv/*" />
    </Router>
  ) : (
    <Redirect to="/login" noThrow />
  )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(Dashboard)
