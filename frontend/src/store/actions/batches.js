import api from '../../utils/api.js'

import {
  BATCH_ADD,
  BATCH_ADD_BULK,
  BATCH_REMOVE,
  BATCHES_ADD_PAGE,
  BATCHES_REMOVE_PAGE,
  BATCHES_REQUEST_PAGE,
  BATCHES_PURGE_PAGINATION,
  BATCH_UPDATE
} from './actionTypes.js'

export const addBatch = data => ({
  type: BATCH_ADD,
  data
})

const removeBatch = id => ({
  type: BATCH_REMOVE,
  id
})

export const purgeBatchesPagination = () => ({
  type: BATCHES_PURGE_PAGINATION
})

export const createBatch = batchData => async dispatch => {
  try {
    const { data, error } = await api('/batches', {
      method: 'POST',
      body: batchData
    })

    if (error) throw error

    if (data) {
      dispatch(addBatch(data))
      dispatch(purgeBatchesPagination())

      return data
    }
  } catch (err) {
    throw err
  }
}

export const updateBatch = (BatchId, batchData) => async dispatch => {
  const { data, error } = await api(`/batches/${BatchId}`, {
    method: 'PATCH',
    body: batchData
  })

  if (error) throw error

  dispatch({ type: BATCH_UPDATE, data })

  return data
}

export const getBatch = id => async dispatch => {
  try {
    let url = `/batches/${id}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch(addBatch(data))

      return data
    }
  } catch (err) {
    if (err.status === 404) {
      dispatch(removeBatch(id))
    } else {
      console.error(err)
    }
  }
}

export const deleteBatch = id => async dispatch => {
  try {
    const { error } = await api(`/batches/${id}`, {
      method: 'DELETE'
    })

    if (error) throw error

    dispatch(removeBatch(id))
    dispatch(purgeBatchesPagination())
  } catch (err) {
    throw err
  }
}

export const fetchBatchesPage = ({
  page = 1,
  query = ''
} = {}) => async dispatch => {
  try {
    dispatch({ type: BATCHES_REQUEST_PAGE, page, query })

    let url = `/batches?page=${page}`
    if (query) url += `&${query}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch({ type: BATCHES_ADD_PAGE, page, data, query })
      dispatch({ type: BATCH_ADD_BULK, data })

      return data
    }
  } catch (err) {
    dispatch({ type: BATCHES_REMOVE_PAGE, page, err, query })
    throw err
  }
}

export const fetchAllBatchesPage = ({ query = '' } = {}) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    try {
      const { nextLink = null, pageIndex } = await dispatch(
        fetchBatchesPage({ page, query })
      )

      hasNext = nextLink
      page = pageIndex + 1
    } catch (err) {
      throw err
    }
  }

  return true
}
