import api from 'utils/api.js'
import {
  ATTENDANCE_SET,
  ATTENDANCE_SET_BULK,
  COURSE_ADD_BULK,
  ENROLLMENT_ADD_BULK_BY_TERM_COURSE,
  FEEDBACKSTATEMENT_BULK_ADD,
  MARKS_CLASSTEST_ADD_BULK_BY_TERM_COURSE,
  MARKS_RESEARCH_ADD_BULK_BY_TERM_COURSE,
  MARKS_SESSIONAL_ADD_BULK_BY_TERM_COURSE,
  MARKS_THEORY_ADD_BULK_BY_TERM_COURSE,
  RESEARCH_ADD_BULK_BY_TERM_COURSE,
  RESEARCH_ADD_BY_TERM_COURSE,
  STUDENTFEEDBACK_ADD_BULK,
  TERMCOURSETEACHERS_SET_BY_TERM,
  TERMCOURSE_ADD,
  TERMCOURSE_UPDATE,
  TERMS_ADD_PAGE,
  TERMS_PURGE_PAGINATION,
  TERMS_REMOVE_PAGE,
  TERMS_REQUEST_PAGE,
  TERM_ADD,
  TERM_ADD_BULK,
  TERM_COURSES_SET,
  TERM_REMOVE,
  TERM_SECTIONS_SET
} from './actionTypes.js'

export const addTerm = data => ({
  type: TERM_ADD,
  data
})

const removeTerm = (id, data = {}) => ({
  type: TERM_REMOVE,
  data: { ...data, id }
})

export const purgeTermsPagination = () => ({
  type: TERMS_PURGE_PAGINATION
})

export const createTerm = termData => async dispatch => {
  try {
    const { data, error } = await api('/terms', {
      method: 'POST',
      body: termData
    })

    if (error) throw error

    if (data) {
      dispatch(addTerm(data))
      dispatch(purgeTermsPagination())

      return data
    }
  } catch (err) {
    throw err
  }
}

export const getTerm = TermId => async dispatch => {
  try {
    let url = `/terms/${TermId}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch(addTerm(data))

      return data
    }
  } catch (err) {
    if (err.status === 404) {
      dispatch(removeTerm(TermId))
    } else {
      console.error(err)
    }
  }
}

export const deleteTerm = TermId => async dispatch => {
  try {
    const { data, error } = await api(`/terms/${TermId}`, {
      method: 'DELETE'
    })

    if (error) throw error

    dispatch(removeTerm(TermId, data))
    dispatch(purgeTermsPagination())
  } catch (err) {
    throw err
  }
}

export const getCoursesForTerm = (
  TermId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/terms/${TermId}/courses`
  if (query) url += `?${query}`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: COURSE_ADD_BULK, data, params })

  return data
}

export const getTermCourseTeachers = (
  TermId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/terms/${TermId}/termcourses/teachers`
  if (query) url += `?${query}`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: TERMCOURSETEACHERS_SET_BY_TERM, data, params })

  return data
}

export const setTermCourseTeachers = (
  TermId,
  courseTeachersData
) => async dispatch => {
  const url = `/terms/${TermId}/termcourses/teachers`

  const { data, error, params } = await api(url, {
    method: 'POST',
    body: courseTeachersData
  })

  if (error) throw error

  dispatch({ type: TERMCOURSETEACHERS_SET_BY_TERM, data, params })

  return data
}

export const getTermCourses = (
  TermId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/terms/${TermId}/termcourses`
  if (query) url += `?${query}`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: TERM_COURSES_SET, data, params })

  return data
}

export const setTermCourses = (TermId, termcoursesData) => async dispatch => {
  const { data, error, params } = await api(`/terms/${TermId}/termcourses`, {
    method: 'PUT',
    body: termcoursesData
  })

  if (error) throw error

  dispatch({ type: TERM_COURSES_SET, data, params })

  return data
}

export const getTermCourse = (TermId, CourseId) => async dispatch => {
  const url = `/terms/${TermId}/termcourses/${CourseId}`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: TERMCOURSE_ADD, data, params })

  return data
}

export const toggleFeedbackOpen = (TermId, CourseId) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/action/toggle-feedback-open`

  const { data, error, params } = await api(url, {
    method: 'POST'
  })

  if (error) throw error

  dispatch({ type: TERMCOURSE_UPDATE, data, params })

  return data
}

export const getAttendances = (TermId, CourseId) => async dispatch => {
  try {
    const url = `/terms/${TermId}/courses/${CourseId}/attendances`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: ATTENDANCE_SET_BULK, data })

    return data
  } catch (err) {
    throw err
  }
}

export const takeAttendance = (
  TermId,
  CourseId,
  attendanceData
) => async dispatch => {
  try {
    const url = `/terms/${TermId}/courses/${CourseId}/attendances`

    const { data, error } = await api(url, {
      method: 'POST',
      body: attendanceData
    })

    if (error) throw error

    dispatch({ type: ATTENDANCE_SET, data })

    return data
  } catch (err) {
    throw err
  }
}

export const updateAttendance = (
  TermId,
  CourseId,
  date,
  attendanceData
) => async dispatch => {
  try {
    const url = `/terms/${TermId}/courses/${CourseId}/attendances/${date}`

    const { data, error } = await api(url, {
      method: 'POST',
      body: attendanceData
    })

    if (error) throw error

    dispatch({ type: ATTENDANCE_SET, data })

    return data
  } catch (err) {
    throw err
  }
}

export const getEnrollments = (
  TermId,
  CourseId,
  { query = '' } = {}
) => async dispatch => {
  try {
    let url = `/terms/${TermId}/courses/${CourseId}/enrollments`
    if (query) url += `?${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: ENROLLMENT_ADD_BULK_BY_TERM_COURSE, data })

    return data
  } catch (err) {
    throw err
  }
}

export const getAllSections = TermId => async dispatch => {
  const url = `/terms/${TermId}/sections`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: TERM_SECTIONS_SET, data, params })

  return data
}

export const setEnrollmentSections = (
  TermId,
  CourseId,
  sectionData
) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/enrollments/sections`

  const { data, error, params } = await api(url, {
    method: 'POST',
    body: sectionData
  })

  if (error) throw error

  dispatch({ type: ENROLLMENT_ADD_BULK_BY_TERM_COURSE, data, params })

  return data
}

export const getResearchEnrollments = (
  TermId,
  CourseId,
  { query = '' } = {}
) => async dispatch => {
  try {
    let url = `/terms/${TermId}/courses/${CourseId}/researches`
    if (query) url += `?${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: RESEARCH_ADD_BULK_BY_TERM_COURSE, data })

    return data
  } catch (err) {
    throw err
  }
}

export const getStudentFeedbacks = (
  TermId,
  CourseId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/terms/${TermId}/courses/${CourseId}/studentfeedbacks`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: STUDENTFEEDBACK_ADD_BULK, data })

  return data
}

export const submitStudentFeedback = (
  TermId,
  CourseId,
  feedbackData
) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/studentfeedbacks/action/submit`

  const { data, error, params } = await api(url, {
    method: 'POST',
    body: feedbackData
  })

  if (error) throw error

  dispatch({ type: STUDENTFEEDBACK_ADD_BULK, data, params })

  return data
}

export const getAllFeedbackStatements = (
  TermId,
  CourseId,
  { query = '' } = {}
) => async dispatch => {
  let url = `/terms/${TermId}/courses/${CourseId}/feedbackstatements`
  if (query) url += `?${query}`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: FEEDBACKSTATEMENT_BULK_ADD, data })

  return data
}

export const setResearchSuperviser = (
  TermId,
  CourseId,
  researchSuperviserData
) => async dispatch => {
  try {
    const url = `/terms/${TermId}/courses/${CourseId}/researches/superviser`

    const { data, error, params } = await api(url, {
      method: 'POST',
      body: researchSuperviserData
    })

    if (error) throw error

    dispatch({ type: RESEARCH_ADD_BY_TERM_COURSE, data, params })

    return data
  } catch (err) {
    throw err
  }
}

export const fetchTermsPage = ({
  page = 1,
  query = ''
} = {}) => async dispatch => {
  try {
    dispatch({ type: TERMS_REQUEST_PAGE, page, query })

    let url = `/terms?page=${page}`
    if (query) url += `&${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: TERM_ADD_BULK, data })
    dispatch({ type: TERMS_ADD_PAGE, page, data, query })

    return data
  } catch (err) {
    dispatch({ type: TERMS_REMOVE_PAGE, page, err, query })
    throw err
  }
}

export const fetchAllTermsPages = ({ query = '' } = {}) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    try {
      const { nextLink = null, pageIndex } = await dispatch(
        fetchTermsPage({ page, query })
      )

      hasNext = nextLink
      page = pageIndex + 1
    } catch (err) {
      throw err
    }
  }

  return true
}

export const getClassTestMarks = (TermId, CourseId) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/marks/theory/classtest`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_CLASSTEST_ADD_BULK_BY_TERM_COURSE, data })

  return data
}

export const getTheoryMarks = (TermId, CourseId) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/marks/theory`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_THEORY_ADD_BULK_BY_TERM_COURSE, data })

  return data
}

export const getSessionalMarks = (TermId, CourseId) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/marks/sessional`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_SESSIONAL_ADD_BULK_BY_TERM_COURSE, data })

  return data
}

export const getResearchMarks = (TermId, CourseId) => async dispatch => {
  const url = `/terms/${TermId}/courses/${CourseId}/marks/research`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_RESEARCH_ADD_BULK_BY_TERM_COURSE, data })

  return data
}
