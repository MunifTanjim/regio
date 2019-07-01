import { keyBy, map, union } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  STUDENTFEEDBACK_ADD_BULK,
  FEEDBACKSTATEMENT_BULK_ADD
} from '../actions/actionTypes.js'
import getGroupedIdsByEntityReducer from './helpers/get-grouped-ids-by-entity-reducer.js'

const groupedIdsByCourseReducer = getGroupedIdsByEntityReducer('CourseId')
const groupedIdsByTermReducer = getGroupedIdsByEntityReducer('TermId')

const initialState = {
  byId: {},
  allIds: [],
  groupedIdsByCourse: {},
  groupedIdsByTerm: {}
}

const itemsReducer = (state = initialState, { type, data, params }) => {
  switch (type) {
    case STUDENTFEEDBACK_ADD_BULK:
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
    default:
      return state
  }
}

const statementItemsReducer = (
  state = { byId: {}, allIds: [] },
  { type, data, params }
) => {
  switch (type) {
    case FEEDBACKSTATEMENT_BULK_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    default:
      return state
  }
}

export default combineReducers({
  items: itemsReducer,
  statementItems: statementItemsReducer
})
