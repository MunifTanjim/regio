import { keyBy, map, union } from 'lodash-es';
import { combineReducers } from 'redux';
import { COUNTRY_ADD, COUNTRY_ADD_BULK } from '../actions/actionTypes.js';



const itemsReducer = (
  state = { byId: {}, allIds: [], query: '' },
  { type, data, query }
) => {
  switch (type) {
    case COUNTRY_ADD:
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
    case COUNTRY_ADD_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        query: query
      }
    default:
      return state
  }
}

export default combineReducers({
  items: itemsReducer
})
