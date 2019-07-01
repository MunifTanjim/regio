import { combineReducers } from 'redux'
import attendances from './attendances.js'
import batches from './batches.js'
import countries from './countries.js'
import courses from './courses.js'
import user from './currentUser.js'
import enrollments from './enrollments.js'
import marks from './marks.js'
import routines from './routines.js'
import sessionyears from './sessionyears.js'
import studentfeedbacks from './studentfeedbacks.js'
import students from './students.js'
import teachers from './teachers.js'
import termcourses from './termcourses.js'
import terms from './terms.js'

// import { CURRENT_USER_LOGOUT } from '../actions/actionTypes.js'

const rootReducer = combineReducers({
  attendances,
  batches,
  countries,
  courses,
  user,
  enrollments,
  marks,
  routines,
  sessionyears,
  studentfeedbacks,
  students,
  teachers,
  termcourses,
  terms
})

export default (state, action) => {
  // if (action.type === CURRENT_USER_LOGOUT) {
  //   state = undefined
  // }

  return rootReducer(state, action)
}
