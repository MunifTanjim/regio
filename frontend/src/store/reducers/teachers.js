import { get, keyBy, map, pickBy, union } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  COURSES_ADD_BULK_FOR_TEACHER_TERM,
  TEACHERS_ADD_PAGE,
  TEACHERS_PURGE_PAGINATION,
  TEACHERS_REMOVE_PAGE,
  TEACHERS_REQUEST_PAGE,
  TEACHER_ADD,
  TEACHER_ADD_BULK,
  TEACHER_REMOVE,
  TEACHER_UPDATE,
  TERM_ADD_BULK_BY_TEACHERID
} from '../actions/actionTypes.js'
import getPaginationReducer from './helpers/get-pagination-reducer.js'

const itemsReducer = (
  state = {
    byId: {},
    allIds: [],
    termsById: {},
    coursesById: {},
    coursesByTerm: {}
  },
  { type, data, id }
) => {
  switch (type) {
    case TEACHER_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: state.allIds.concat(data.id)
      }
    case TEACHER_ADD_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    case TEACHER_REMOVE:
      return {
        ...state,
        byId: pickBy(state.byId, item => item.id !== id),
        allIds: state.allIds.filter(_id => _id !== id)
      }
    case TEACHER_UPDATE:
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
    case TERM_ADD_BULK_BY_TEACHERID:
      return {
        ...state,
        termsById: {
          ...state.termsById,
          [data.params.TeacherId]: union(
            get(state.termsById, data.params.TeacherId, []),
            map(data.items, 'id')
          )
        }
      }
    case COURSES_ADD_BULK_FOR_TEACHER_TERM:
      return {
        ...state,
        coursesById: {
          ...state.coursesById,
          [data.params.TeacherId]: union(
            get(state.coursesById, data.params.TeacherId, []),
            map(data.items, 'id')
          )
        },
        coursesByTerm: {
          ...state.coursesByTerm,
          [data.params.TermId]: union(
            get(state.coursesByTerm, data.params.TermId, []),
            map(data.items, 'id')
          )
        }
      }
    default:
      return state
  }
}

const studentsReducer = combineReducers({
  items: itemsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: TEACHERS_ADD_PAGE,
    REMOVE_PAGE: TEACHERS_REMOVE_PAGE,
    REQUEST_PAGE: TEACHERS_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === TEACHERS_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return studentsReducer(state, action)
}
