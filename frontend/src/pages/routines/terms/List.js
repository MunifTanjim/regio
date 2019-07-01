import HeaderGrid from 'components/HeaderGrid'
import Items from 'components/Pagination/Items.js'
import Switcher from 'components/Pagination/Switcher.js'
import usePaginationHandler from 'hooks/usePaginationHandler'
import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import { Header, Segment } from 'semantic-ui-react'
import { fetchTermsPage } from 'store/actions/terms.js'
import RoutineTermsListItem from './ListItem.js'

function RoutineTermsList({ pagination, fetchTermsPage, linkToBase }) {
  const [[page, handlePageChange]] = usePaginationHandler(
    pagination,
    fetchTermsPage,
    { initialQueryObject: { length: 8, sort: '-SessionYearId' } }
  )

  const loading = get(pagination.pages[page], `fetching`, [])

  return (
    <>
      <Segment>
        <HeaderGrid Left={<Header>Terms</Header>} />
      </Segment>
      <Items
        ids={get(pagination.pages[page], `itemIds`, [])}
        loading={loading}
        Item={RoutineTermsListItem}
        linkToBase={linkToBase}
      />
      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const mapStateToProps = ({ terms }) => ({
  pagination: terms.pagination
})

const mapDispatchToProps = {
  fetchTermsPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineTermsList)
