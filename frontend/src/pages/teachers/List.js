import Header from 'components/Pagination/Header.js'
import Items from 'components/Pagination/Items.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import usePaginationHandler from '../../hooks/usePaginationHandler.js'
import { fetchTeachersPage } from '../../store/actions/teachers.js'
import Item from './ListItem.js'

function List({ pagination, fetchTeachersPage }) {
  const [[page, handlePageChange]] = usePaginationHandler(
    pagination,
    fetchTeachersPage
  )

  const loading = get(pagination.pages[page], `fetching`, [])

  return (
    <Permit sysadmin head student teacher>
      <Header title={`Teachers`} loading={loading} />
      <Items
        ids={get(pagination.pages[page], `itemIds`, [])}
        loading={loading}
        Item={Item}
      />
      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </Permit>
  )
}

const mapStateToProps = ({ teachers }) => ({
  pagination: teachers.pagination
})

const mapDispatchToProps = {
  fetchTeachersPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
