import { get, groupBy, keyBy, map, mapValues, union } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  TERMCOURSES_SET_BY_COURSEID,
  TERMCOURSETEACHERS_SET_BY_TERM,
  TERM_COURSES_SET,
  TERMCOURSE_ADD,
  TERMCOURSE_UPDATE
} from 'store/actions/actionTypes.js'
import getGroupedIdsByEntityReducer from './helpers/get-grouped-ids-by-entity-reducer.js'

const groupedIdsByTermReducer = getGroupedIdsByEntityReducer('TermId')

const itemsReducer = (
  state = {
    byId: {},
    allIds: [],
    groupedIdsByTerm: {},
    byCourseId: {}
  },
  { type, data, params }
) => {
  switch (type) {
    case TERM_COURSES_SET:
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
    case TERMCOURSE_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: union(state.allIds, [data.id]),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data,
          params
        })
      }
    case TERMCOURSE_UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...get(state.byId, data.id, {}),
            ...data
          }
        }
      }
    case TERMCOURSES_SET_BY_COURSEID:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        byCourseId: {
          ...state.byCourseId,
          [data.params.CourseId]: map(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    default:
      return state
  }
}

const teacherIdsBySectionReducer = (state = {}, { type, data, params }) => {
  switch (type) {
    case TERMCOURSETEACHERS_SET_BY_TERM:
      return {
        ...state,
        ...mapValues(
          groupBy(data.items, item => `${item.TermId}_${item.CourseId}`),
          group =>
            mapValues(groupBy(group, 'section'), item => map(item, 'TeacherId'))
        )
      }
    default:
      return state
  }
}

const sectionsByTeacherIdReducer = (state = {}, { type, data, params }) => {
  switch (type) {
    case TERMCOURSETEACHERS_SET_BY_TERM:
      return {
        ...state,
        ...mapValues(
          groupBy(data.items, item => `${item.TermId}_${item.CourseId}`),
          group =>
            mapValues(groupBy(group, 'TeacherId'), item => map(item, 'section'))
        )
      }
    default:
      return state
  }
}

export default combineReducers({
  items: itemsReducer,
  teacherIdsBySection: teacherIdsBySectionReducer,
  sectionsByTeacherId: sectionsByTeacherIdReducer
})
