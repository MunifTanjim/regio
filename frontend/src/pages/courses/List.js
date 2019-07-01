import { get } from 'lodash-es'
import React from 'react'
import { connect } from 'react-redux'
import Header from '../../components/Pagination/Header.js'
import Items from '../../components/Pagination/Items.js'
import Switcher from '../../components/Pagination/Switcher.js'
import usePaginationHandler from '../../hooks/usePaginationHandler.js'
import { fetchCoursesPage } from '../../store/actions/courses.js'
import Create from './ActionModals/Create.js'
import Item from './ListItem.js'

function List({ pagination, fetchCoursesPage }) {
  const [[page, onPageChange]] = usePaginationHandler(
    pagination,
    fetchCoursesPage
  )

  const loading = get(pagination.pages[page], `fetching`)

  return (
    <>
      <Header title={`Courses`} loading={loading} actions={<Create />} />
      <Items
        ids={get(pagination.pages[page], `itemIds`, [])}
        loading={loading}
        Item={Item}
      />
      <Switcher
        activePage={page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </>
  )
}

const mapStateToProps = ({ courses }) => ({
  pagination: courses.pagination
})

const mapDispatchToProps = {
  fetchCoursesPage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
