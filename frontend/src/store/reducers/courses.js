import { keyBy, map, pickBy, union } from 'lodash-es';
import { combineReducers } from 'redux';
import { COURSES_ADD_BULK_FOR_TEACHER_TERM, COURSES_ADD_PAGE, COURSES_PURGE_PAGINATION, COURSES_REMOVE_PAGE, COURSES_REQUEST_PAGE, COURSE_ADD, COURSE_ADD_BULK, COURSE_REMOVE, COURSE_UPDATE } from '../actions/actionTypes.js';
import getPaginationReducer from './helpers/get-pagination-reducer.js';




const itemsReducer = (state = { byId: {}, allIds: [] }, { type, data, id }) => {
  switch (type) {
    case COURSE_ADD:
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
    case COURSE_ADD_BULK:
    case COURSES_ADD_BULK_FOR_TEACHER_TERM:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    case COURSE_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, i => i !== id),
        allIds: state.allIds.filter(i => i !== id)
      }
    case COURSE_UPDATE:
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

const coursesReducer = combineReducers({
  items: itemsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: COURSES_ADD_PAGE,
    REMOVE_PAGE: COURSES_REMOVE_PAGE,
    REQUEST_PAGE: COURSES_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === COURSES_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return coursesReducer(state, action)
}
