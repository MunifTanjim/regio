import api from '../../utils/api.js'

import {
  COURSE_ADD,
  COURSE_ADD_BULK,
  COURSE_REMOVE,
  COURSES_ADD_PAGE,
  COURSES_REMOVE_PAGE,
  COURSES_REQUEST_PAGE,
  COURSES_PURGE_PAGINATION,
  TERMCOURSES_SET_BY_COURSEID
} from './actionTypes.js'

export const addCourse = data => ({
  type: COURSE_ADD,
  data
})

const removeCourse = id => ({
  type: COURSE_REMOVE,
  id
})

export const purgeCoursesPagination = () => ({
  type: COURSES_PURGE_PAGINATION
})

export const createCourse = courseData => async dispatch => {
  try {
    const { data, error } = await api('/courses', {
      method: 'POST',
      body: courseData
    })

    if (error) throw error

    if (data) {
      dispatch(addCourse(data))
      dispatch(purgeCoursesPagination())

      return data
    }
  } catch (err) {
    throw err
  }
}

export const getCourse = id => async dispatch => {
  try {
    let url = `/courses/${id}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch(addCourse(data))

      return data
    }
  } catch (err) {
    if (err.status === 404) {
      dispatch(removeCourse(id))
    } else {
      console.error(err)
    }
  }
}

export const deleteCourse = id => async dispatch => {
  try {
    const { error } = await api(`/courses/${id}`, {
      method: 'DELETE'
    })

    if (error) throw error

    dispatch(removeCourse(id))
    dispatch(purgeCoursesPagination())
  } catch (err) {
    throw err
  }
}

export const getTermCourses = (
  CourseId,
  { query = '' } = {}
) => async dispatch => {
  try {
    let url = `/courses/${CourseId}/termcourses`
    if (query) url += `?${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: TERMCOURSES_SET_BY_COURSEID, data })

    return data
  } catch (err) {
    throw err
  }
}

export const fetchCoursesPage = (
  { page = 1, query = '' } = {},
  storeItems = true
) => async dispatch => {
  try {
    dispatch({ type: COURSES_REQUEST_PAGE, page, query })

    let url = `/courses?page=${page}`
    if (query) url += `&${query}`

    const { data, error } = await api(url)

    if (error) throw error

    if (storeItems) dispatch({ type: COURSE_ADD_BULK, data })

    dispatch({ type: COURSES_ADD_PAGE, page, data, query })

    return data
  } catch (err) {
    dispatch({ type: COURSES_REMOVE_PAGE, page, err, query })
    throw err
  }
}

export const fetchAllCoursesPage = (
  { query = '' } = {},
  storeItems = true
) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    try {
      const { nextLink = null, pageIndex } = await dispatch(
        fetchCoursesPage({ page, query }, storeItems)
      )

      hasNext = nextLink
      page = pageIndex + 1
    } catch (err) {
      throw err
    }
  }

  return true
}
