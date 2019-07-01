import { get, groupBy, keyBy, map, mapValues, union } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  ENROLLMENTS_APPROVE_BY_STUDENTID_TERMID,
  ENROLLMENT_ADD_BULK_BY_STUDENTID,
  ENROLLMENT_ADD_BULK_BY_TERM_COURSE,
  RESEARCH_ADD_BULK_BY_TERM_COURSE,
  RESEARCH_ADD_BY_TERM_COURSE,
  ENROLLMENT_ADD_BY_STUDENT_TERM_COURSE
} from '../actions/actionTypes.js'
import getGroupedIdsByEntityReducer from './helpers/get-grouped-ids-by-entity-reducer.js'

const groupedIdsByCourseReducer = getGroupedIdsByEntityReducer('CourseId')
const groupedIdsByStudentReducer = getGroupedIdsByEntityReducer('StudentId')
const groupedIdsByTermReducer = getGroupedIdsByEntityReducer('TermId')

const initialState = {
  byId: {},
  allIds: [],
  groupedIds: {},
  groupedIdsByCourse: {},
  groupedIdsByStudent: {},
  groupedIdsByTerm: {},
  researches: {}
}

const itemsReducer = (state = initialState, { type, data, params }) => {
  switch (type) {
    case ENROLLMENT_ADD_BY_STUDENT_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: union(state.allIds, [data.id]),
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data, params }
        ),
        groupedIdsByStudent: groupedIdsByStudentReducer(
          state.groupedIdsByStudent,
          { data, params }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data,
          params
        })
      }
    case ENROLLMENT_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data, params }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data,
          params
        })
      }
    case ENROLLMENTS_APPROVE_BY_STUDENTID_TERMID:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        groupedIdsByStudent: groupedIdsByStudentReducer(
          state.groupedIdsByStudent,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case ENROLLMENT_ADD_BULK_BY_STUDENTID:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        groupedIdsByStudent: groupedIdsByStudentReducer(
          state.groupedIdsByStudent,
          { data }
        ),
        groupedIds: {
          ...state.groupedIds,
          [data.params.StudentId]: {
            ...get(state.groupedIds, data.params.StudentId, {}),
            ...mapValues(groupBy(data.items, 'TermId'), enrollmentsByTermId =>
              map(enrollmentsByTermId, 'id')
            )
          }
        }
      }
    case RESEARCH_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        researches: {
          ...state.researches,
          ...keyBy(data.items, 'id')
        }
      }
    case RESEARCH_ADD_BY_TERM_COURSE:
      return {
        ...state,
        researches: {
          ...state.researches,
          [data.id]: {
            ...get(state.researches, data.id, {}),
            ...data
          }
        }
      }
    default:
      return state
  }
}

const researchItemsReducer = (
  state = {
    byId: {},
    allIds: [],
    groupedIdsByCourse: {},
    groupedIdsByTerm: {}
  },
  { type, data, params }
) => {
  switch (type) {
    case RESEARCH_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case RESEARCH_ADD_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...get(state.byId, data.id, {}),
            ...data
          }
        },
        allIds: union(state.allIds, [data.id]),
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data, params }
        ),
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
  researchItems: researchItemsReducer
})
