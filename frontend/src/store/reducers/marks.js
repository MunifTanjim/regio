import { keyBy } from 'lodash-es'
import { combineReducers } from 'redux'
import {
  MARKS_CLASSTEST_ADD_BULK_BY_STUDENT_TERM_COURSE,
  MARKS_CLASSTEST_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_RESEARCH_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_SESSIONAL_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_THEORY_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_THEORY_ADD_BY_STUDENT_TERM_COURSE,
  MARKS_SESSIONAL_ADD_BY_STUDENT_TERM_COURSE,
  MARKS_RESEARCH_ADD_BY_STUDENT_TERM_COURSE,
  MARKS_CLASSTEST_ADD_BULK_BY_TERM_COURSE,
  MARKS_THEORY_ADD_BULK_BY_TERM_COURSE,
  MARKS_SESSIONAL_ADD_BULK_BY_TERM_COURSE,
  MARKS_RESEARCH_ADD_BULK_BY_TERM_COURSE
} from '../actions/actionTypes.js'
import getGroupedIdsByEntityReducer from './helpers/get-grouped-ids-by-entity-reducer.js'

const groupedIdsByCourseReducer = getGroupedIdsByEntityReducer('CourseId')
const groupedIdsByStudentReducer = getGroupedIdsByEntityReducer('StudentId')
const groupedIdsByTeacherReducer = getGroupedIdsByEntityReducer('TeacherId')
const groupedIdsByTermReducer = getGroupedIdsByEntityReducer('TermId')

const classtestItemsReducer = (
  state = {
    byId: {},
    groupedIdsByCourse: {},
    groupedIdsByStudent: {},
    groupedIdsByTeacher: {},
    groupedIdsByTerm: {}
  },
  { type, data }
) => {
  switch (type) {
    case MARKS_CLASSTEST_ADD_BULK_BY_STUDENT_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByStudent: groupedIdsByStudentReducer(
          state.groupedIdsByStudent,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case MARKS_CLASSTEST_ADD_BULK_BY_TEACHER_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTeacher: groupedIdsByTeacherReducer(
          state.groupedIdsByTeacher,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case MARKS_CLASSTEST_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    default:
      return state
  }
}

const theoryItemsReducer = (
  state = {
    byId: {},
    groupedIdsByCourse: {},
    groupedIdsByStudent: {},
    groupedIdsByTeacher: {},
    groupedIdsByTerm: {}
  },
  { type, data, params }
) => {
  switch (type) {
    case MARKS_THEORY_ADD_BY_STUDENT_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
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
    case MARKS_THEORY_ADD_BULK_BY_TEACHER_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTeacher: groupedIdsByTeacherReducer(
          state.groupedIdsByTeacher,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case MARKS_THEORY_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    default:
      return state
  }
}

const sessionalItemsReducer = (
  state = {
    byId: {},
    groupedIdsByCourse: {},
    groupedIdsByStudent: {},
    groupedIdsByTeacher: {},
    groupedIdsByTerm: {}
  },
  { type, data, params }
) => {
  switch (type) {
    case MARKS_SESSIONAL_ADD_BY_STUDENT_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
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
    case MARKS_SESSIONAL_ADD_BULK_BY_TEACHER_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTeacher: groupedIdsByTeacherReducer(
          state.groupedIdsByTeacher,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case MARKS_SESSIONAL_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    default:
      return state
  }
}

const researchItemsReducer = (
  state = {
    byId: {},
    groupedIdsByCourse: {},
    groupedIdsByStudent: {},
    groupedIdsByTeacher: {},
    groupedIdsByTerm: {}
  },
  { type, data, params }
) => {
  switch (type) {
    case MARKS_RESEARCH_ADD_BY_STUDENT_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
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
    case MARKS_RESEARCH_ADD_BULK_BY_TEACHER_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTeacher: groupedIdsByTeacherReducer(
          state.groupedIdsByTeacher,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    case MARKS_RESEARCH_ADD_BULK_BY_TERM_COURSE:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        groupedIdsByCourse: groupedIdsByCourseReducer(
          state.groupedIdsByCourse,
          { data }
        ),
        groupedIdsByTerm: groupedIdsByTermReducer(state.groupedIdsByTerm, {
          data
        })
      }
    default:
      return state
  }
}

const classtestReducer = combineReducers({
  items: classtestItemsReducer
})

const theoryReducer = combineReducers({
  items: theoryItemsReducer
})

const sessionalReducer = combineReducers({
  items: sessionalItemsReducer
})

const researchReducer = combineReducers({
  items: researchItemsReducer
})

export default combineReducers({
  classtest: classtestReducer,
  theory: theoryReducer,
  sessional: sessionalReducer,
  research: researchReducer
})
