import { keyBy, map, pickBy, union } from 'lodash-es';
import { combineReducers } from 'redux';
import { SESSIONYEARS_ADD_PAGE, SESSIONYEARS_PURGE_PAGINATION, SESSIONYEARS_REMOVE_PAGE, SESSIONYEARS_REQUEST_PAGE, SESSIONYEAR_ADD, SESSIONYEAR_ADD_BULK, SESSIONYEAR_REMOVE, SESSIONYEAR_UPDATE } from '../actions/actionTypes.js';
import getPaginationReducer from './helpers/get-pagination-reducer.js';




const itemsReducer = (
  state = { byId: {}, allIds: [], totalItems: 0 },
  { type, data, id }
) => {
  switch (type) {
    case SESSIONYEAR_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: union(state.allIds, [data.id])
      }
    case SESSIONYEAR_ADD_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    case SESSIONYEAR_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, i => i !== id),
        allIds: state.allIds.filter(i => i !== id)
      }
    case SESSIONYEAR_UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...state.byId[data.id],
            ...data
          }
        }
      }
    default:
      return state
  }
}

const sessionyearsReducer = combineReducers({
  items: itemsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: SESSIONYEARS_ADD_PAGE,
    REMOVE_PAGE: SESSIONYEARS_REMOVE_PAGE,
    REQUEST_PAGE: SESSIONYEARS_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === SESSIONYEARS_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return sessionyearsReducer(state, action)
}
