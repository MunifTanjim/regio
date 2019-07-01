import { map, pickBy, uniq } from 'lodash-es';
import { combineReducers } from 'redux';
import { BATCHES_ADD_PAGE, BATCHES_PURGE_PAGINATION, BATCHES_REMOVE_PAGE, BATCHES_REQUEST_PAGE, BATCH_ADD, BATCH_ADD_BULK, BATCH_REMOVE, BATCH_UPDATE } from '../actions/actionTypes.js';
import getPaginationReducer from './helpers/get-pagination-reducer.js';




const itemsReducer = (
  state = { byId: {}, allIds: [], totalItems: 0 },
  { type, data, id }
) => {
  switch (type) {
    case BATCH_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: uniq(state.allIds.concat(data.id))
      }
    case BATCH_ADD_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...data.items.reduce((byId, item) => {
            byId[item.id] = item
            return byId
          }, {})
        },
        allIds: uniq(state.allIds.concat(map(data.items, 'id')))
      }
    case BATCH_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, i => i !== id),
        allIds: state.allIds.filter(i => i !== id)
      }
    case BATCH_UPDATE:
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

const batchesReducer = combineReducers({
  items: itemsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: BATCHES_ADD_PAGE,
    REMOVE_PAGE: BATCHES_REMOVE_PAGE,
    REQUEST_PAGE: BATCHES_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === BATCHES_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return batchesReducer(state, action)
}
