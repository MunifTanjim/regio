import { get, keyBy, map, pick, union } from 'lodash-es';
import { combineReducers } from 'redux';
import { ATTENDANCE_ADD_FOR_STUDENT_BY_TERM_COURSE, ATTENDANCE_SET, ATTENDANCE_SET_BULK } from '../actions/actionTypes.js';



const itemsReducer = (state = { byId: {}, allIds: [] }, { type, data }) => {
  switch (type) {
    case ATTENDANCE_SET_BULK:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id'))
      }
    case ATTENDANCE_SET:
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

    default:
      return state
  }
}

const forStudentsReducer = (state = {}, { type, data }) => {
  switch (type) {
    case ATTENDANCE_ADD_FOR_STUDENT_BY_TERM_COURSE:
      return {
        ...state,
        [data.params.StudentId]: {
          ...get(state, data.params.StudentId, {}),
          [data.params.TermId]: {
            ...get(state, [data.params.StudentId, data.params.TermId], {}),
            [data.params.CourseId]: pick(data, ['allDates', 'attendedDates'])
          }
        }
      }
    default:
      return state
  }
}

export default combineReducers({
  items: itemsReducer,
  forStudents: forStudentsReducer
})
