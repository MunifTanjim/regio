import { Router } from '@reach/router'
import Permit from 'components/Permit.js'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllTeachersPage } from 'store/actions/teachers.js'
import List from './List.js'
import View from './View.js'

function Batches({ fetchAllTeachersPage }) {
  useEffect(() => {
    fetchAllTeachersPage()
  }, [fetchAllTeachersPage])

  return (
    <Permit sysadmin head>
      <Router>
        <List path="/" />
        <View path=":BatchId" />
      </Router>
    </Permit>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  fetchAllTeachersPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Batches)
