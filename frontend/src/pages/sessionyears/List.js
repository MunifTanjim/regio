import Header from 'components/Pagination/Header.js'
import Items from 'components/Pagination/Items.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import usePaginationHandler from 'hooks/usePaginationHandler.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { fetchSessionYearsPage } from 'store/actions/sessionyears.js'
import Create from './ActionModals/Create.js'
import Item from './ListItem.js'

function List({ pagination, fetchSessionYearsPage }) {
  const [[page, handlePageChange]] = usePaginationHandler(
    pagination,
    fetchSessionYearsPage
  )

  const loading = get(pagination.pages[page], `fetching`, false)

  return (
    <Permit sysadmin head>
      <Header title={`Sessions`} loading={loading} actions={<Create />} />
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

const mapStateToProps = ({ sessionyears }) => ({
  pagination: sessionyears.pagination
})

const mapDispatchToProps = {
  fetchSessionYearsPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
