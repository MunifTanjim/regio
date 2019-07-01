import Header from 'components/Pagination/Header.js'
import Items from 'components/Pagination/Items.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import usePaginationHandler from 'hooks/usePaginationHandler.js'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { fetchBatchesPage } from 'store/actions/batches.js'
import Create from './ActionModals/Create.js'
import Item from './ListItem.js'

function List({ pagination, fetchBatchesPage }) {
  const [[page, handlePageChange]] = usePaginationHandler(
    pagination,
    fetchBatchesPage
  )

  const loading = get(pagination.pages[page], `fetching`, true)

  return (
    <Permit sysadmin head>
      <Header title={`Batches`} loading={loading} actions={<Create />} />
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

const mapStateToProps = ({ batches }) => ({
  pagination: batches.pagination
})

const mapDispatchToProps = {
  fetchBatchesPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
