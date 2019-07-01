import api from '../../utils/api.js'

import { COUNTRY_ADD, COUNTRY_ADD_BULK } from './actionTypes.js'

export const getCountry = id => async dispatch => {
  let url = `/countries/${id}`

  const { data, error } = await api(url)

  if (error) throw error

  if (data) {
    dispatch({ type: COUNTRY_ADD, data })

    return data
  }
}

export const getAllCountries = ({ query = '' } = {}) => async dispatch => {
  let url = `/countries`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  if (data) {
    dispatch({ type: COUNTRY_ADD_BULK, data, query })

    return data
  }
}
