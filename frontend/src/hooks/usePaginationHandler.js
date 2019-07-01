import { get } from 'lodash-es'
import { stringify } from 'query-string'
import { useCallback, useEffect, useMemo, useState } from 'react'
import usePrevious from './usePrevious.js'

const defaultOptions = { maxTryCount: 3, initialQueryObject: {} }

function usePaginationHandler(
  pagination,
  fetchPage,
  { maxTryCount = 3, initialQueryObject = {} } = defaultOptions
) {
  const [tryCount, setTryCount] = useState(0)

  const [page, setPage] = useState(1)
  const prevPage = usePrevious(page)

  const [queryObject, setQueryObject] = useState(initialQueryObject)

  const query = useMemo(() => stringify(queryObject), [queryObject])

  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    const prevQuery = get(pagination.pages[page], 'query')

    if (pagination.pages[page] && query === prevQuery) return

    setTryCount(c => (page === prevPage && query === prevQuery ? c + 1 : 1))

    if (tryCount < maxTryCount) fetchPage({ page, query })
  }, [
    fetchPage,
    maxTryCount,
    page,
    pagination.pages,
    prevPage,
    query,
    tryCount
  ])

  const onPageChange = useCallback(
    (_, { activePage: page }) => {
      if (!pagination.pages[page]) {
        fetchPage({ page, query })
      }

      setPage(page)
    },
    [query, pagination, fetchPage, setPage]
  )

  return [[page, onPageChange], setQueryObject]
}

export default usePaginationHandler
