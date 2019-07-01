import { keyBy, map, union } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  ROUTINES_ADD_BULK_BY_TERM,
  ROUTINE_SLOTS_SET_ALL,
  WEEKPLANS_ADD_BULK_BY_TERM
} from 'store/actions/actionTypes.js'
import getGroupedIdsByEntityReducer from './helpers/get-grouped-ids-by-entity-reducer.js'

const groupedIdsByTermReducer = getGroupedIdsByEntityReducer('TermId')

const itemsReducer = (
  state = { byId: {}, allIds: [], groupedIdsByTerm: {} },
  { type, data, params }
) => {
  switch (type) {
    case ROUTINES_ADD_BULK_BY_TERM:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data,
          params
        })
      }
    default:
      return state
  }
}

const slotItemsReducer = (
  state = { byId: {}, allIds: [], query: '' },
  { type, data, query }
) => {
  switch (type) {
    case ROUTINE_SLOTS_SET_ALL:
      return {
        byId: keyBy(data.items, 'id'),
        allIds: map(data.items, 'id'),
        query
      }
    default:
      return state
  }
}

const weekPlanItemsReducer = (
  state = { byId: {}, allIds: [], groupedIdsByTerm: {} },
  { type, data, params }
) => {
  switch (type) {
    case WEEKPLANS_ADD_BULK_BY_TERM:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data,
          params
        })
      }
    default:
      return state
  }
}

export default combineReducers({
  items: itemsReducer,
  slotItems: slotItemsReducer,
  weekPlanItems: weekPlanItemsReducer
})
