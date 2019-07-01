import api from 'utils/api.js'
import {
  ROUTINES_ADD_BULK_BY_TERM,
  ROUTINE_SLOTS_SET_ALL,
  WEEKPLANS_ADD_BULK_BY_TERM
} from './actionTypes.js'

export const getAllSlots = ({ query = '' } = {}) => async dispatch => {
  let url = `/routines/slots`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: ROUTINE_SLOTS_SET_ALL, data, query })

  return data
}

export const getAllRoutinesForTerm = (
  TermId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/routines/terms/${TermId}`
  if (query) url += `?${query}`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: ROUTINES_ADD_BULK_BY_TERM, data, params })

  return data
}

export const setRoutinesForTermSection = routineData => async dispatch => {
  const url = `/routines`

  const { data, error, params } = await api(url, {
    method: 'POST',
    body: routineData
  })

  if (error) throw error

  dispatch({ type: ROUTINES_ADD_BULK_BY_TERM, data, params })

  return data
}

export const getAllWeekPlansForTerm = (
  TermId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/weekplans/terms/${TermId}`
  if (query) url += `?${query}`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: WEEKPLANS_ADD_BULK_BY_TERM, data, params })

  return data
}

export const setWeekPlanForTermSection = weekPlanData => async dispatch => {
  const url = `/weekplans`

  const { data, error, params } = await api(url, {
    method: 'POST',
    body: weekPlanData
  })

  if (error) throw error

  dispatch({ type: WEEKPLANS_ADD_BULK_BY_TERM, data, params })

  return data
}
