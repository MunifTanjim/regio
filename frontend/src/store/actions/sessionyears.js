import api from '../../utils/api.js'

import {
  SESSIONYEAR_ADD,
  SESSIONYEAR_ADD_BULK,
  SESSIONYEAR_REMOVE,
  SESSIONYEARS_ADD_PAGE,
  SESSIONYEARS_REMOVE_PAGE,
  SESSIONYEARS_REQUEST_PAGE,
  SESSIONYEARS_PURGE_PAGINATION,
  SESSIONYEARS_UPDATE_COUNT
} from './actionTypes.js'

export const addSessionYear = data => ({
  type: SESSIONYEAR_ADD,
  data
})

const removeSessionYear = id => ({
  type: SESSIONYEAR_REMOVE,
  id
})

export const purgeSessionYearsPagination = () => ({
  type: SESSIONYEARS_PURGE_PAGINATION
})

export const createSessionYear = sessionYearData => async dispatch => {
  try {
    const { data, error } = await api('/sessionyears', {
      method: 'POST',
      body: sessionYearData
    })

    if (error) throw error

    if (data) {
      dispatch(addSessionYear(data))
      dispatch(purgeSessionYearsPagination())

      return data
    }
  } catch (err) {
    throw err
  }
}

export const getSessionYear = id => async dispatch => {
  try {
    let url = `/sessionyears/${id}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch(addSessionYear(data))

      return data
    }
  } catch (err) {
    if (err.status === 404) {
      dispatch(removeSessionYear(id))
    } else {
      console.error(err)
    }
  }
}

export const deleteSessionYear = id => async dispatch => {
  try {
    const { error } = await api(`/sessionyears/${id}`, {
      method: 'DELETE'
    })

    if (error) throw error

    dispatch(removeSessionYear(id))
    dispatch(purgeSessionYearsPagination())
  } catch (err) {
    throw err
  }
}

const filterMap = {
  all: ''
}

export const filterNames = {
  all: `All`
}

export const countSessionYears = ({
  filter = 'all'
} = {}) => async dispatch => {
  try {
    let url = `/sessionyears/count?`
    if (filterMap[filter]) url += `filter=${filterMap[filter]}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch({ type: SESSIONYEARS_UPDATE_COUNT, data, filter })

      return data
    }
  } catch (err) {
    throw err
  }
}

export const fetchSessionYearsPage = ({
  page = 1,
  query = ''
} = {}) => async dispatch => {
  try {
    dispatch({ type: SESSIONYEARS_REQUEST_PAGE, page, query })

    let url = `/sessionyears?page=${page}`
    if (query) url += `&${query}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch({ type: SESSIONYEAR_ADD_BULK, data })
      dispatch({ type: SESSIONYEARS_ADD_PAGE, page, data, query })

      return data
    }
  } catch (err) {
    dispatch({ type: SESSIONYEARS_REMOVE_PAGE, page, err, query })
    throw err
  }
}

export const fetchAllSessionYearsPage = ({
  query = ''
} = {}) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    try {
      const { nextLink = null, pageIndex } = await dispatch(
        fetchSessionYearsPage({ page, query })
      )

      hasNext = nextLink
      page = pageIndex + 1
    } catch (err) {
      throw err
    }
  }

  return true
}
