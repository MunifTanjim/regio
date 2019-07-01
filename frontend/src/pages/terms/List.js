import Header from 'components/Pagination/Header.js'
import Items from 'components/Pagination/Items.js'
import Switcher from 'components/Pagination/Switcher.js'
import Permit from 'components/Permit.js'
import usePaginationHandler from 'hooks/usePaginationHandler.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchAllSessionYearsPage } from 'store/actions/sessionyears.js'
import { fetchAllBatchesPage } from 'store/actions/batches.js'
import { fetchTermsPage } from 'store/actions/terms.js'
import Create from './ActionModals/Create.js'
import Item from './ListItem.js'

function List({
  pagination,
  fetchTermsPage,
  fetchAllSessionYearsPage,
  fetchAllBatchesPage
}) {
  useEffect(() => {
    fetchAllSessionYearsPage()
    fetchAllBatchesPage()
  }, [fetchAllBatchesPage, fetchAllSessionYearsPage])

  const [[page, handlePageChange]] = usePaginationHandler(
    pagination,
    fetchTermsPage
  )

  const loading = get(pagination.pages[page], `fetching`, false)

  return (
    <Permit sysadmin head teacher>
      <Header title={`Terms`} loading={loading} actions={<Create />} />
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

const mapStateToProps = ({ terms }) => ({
  pagination: terms.pagination
})

const mapDispatchToProps = {
  fetchTermsPage,
  fetchAllSessionYearsPage,
  fetchAllBatchesPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
