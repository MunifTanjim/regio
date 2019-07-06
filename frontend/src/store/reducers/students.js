import { keyBy, map, pickBy, union } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  STUDENTS_ADD_PAGE,
  STUDENTS_PURGE_PAGINATION,
  STUDENTS_REMOVE_PAGE,
  STUDENTS_REQUEST_PAGE,
  STUDENT_ADD,
  STUDENT_ADD_BULK,
  STUDENT_REMOVE,
  STUDENT_UPDATE,
  STUDENT_ADVISER_SET
} from '../actions/actionTypes.js'
import getPaginationReducer from './helpers/get-pagination-reducer.js'

const itemsReducer = (
  state = { byId: {}, allIds: [], totalItems: 0 },
  { type, data, id }
) => {
  switch (type) {
    case STUDENT_ADD:
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
    case STUDENT_ADD_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    case STUDENT_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, item => item.id !== id),
        allIds: state.allIds.filter(_id => _id !== id)
      }
    case STUDENT_UPDATE:
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
    case STUDENT_ADVISER_SET:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.StudentId]: {
            ...state.byId[data.StudentId],
            adviserId: data.TeacherId
          }
        }
      }
    default:
      return state
  }
}

const studentsReducer = combineReducers({
  items: itemsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: STUDENTS_ADD_PAGE,
    REMOVE_PAGE: STUDENTS_REMOVE_PAGE,
    REQUEST_PAGE: STUDENTS_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === STUDENTS_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return studentsReducer(state, action)
}
