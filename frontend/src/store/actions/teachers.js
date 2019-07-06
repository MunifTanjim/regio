import api from 'utils/api.js'
import {
  COURSES_ADD_BULK_FOR_TEACHER_TERM,
  MARKS_CLASSTEST_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_RESEARCH_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_SESSIONAL_ADD_BULK_BY_TEACHER_TERM_COURSE,
  MARKS_THEORY_ADD_BULK_BY_TEACHER_TERM_COURSE,
  TEACHERS_ADD_PAGE,
  TEACHERS_PURGE_PAGINATION,
  TEACHERS_REMOVE_PAGE,
  TEACHERS_REQUEST_PAGE,
  TEACHER_ADD,
  TEACHER_ADD_BULK,
  TEACHER_REMOVE,
  TEACHER_UPDATE,
  TERM_ADD_BULK_BY_TEACHERID
} from './actionTypes.js'

export const addTeacher = data => ({
  type: TEACHER_ADD,
  data
})

export const removeTeacher = id => ({
  type: TEACHER_REMOVE,
  id
})

export const purgeTeachersPagination = () => ({
  type: TEACHERS_PURGE_PAGINATION
})

export const createTeacher = teacherData => async dispatch => {
  const { data, error } = await api('/teachers', {
    method: 'POST',
    body: teacherData
  })

  if (error) throw error

  if (data) {
    dispatch(addTeacher(data))
    dispatch(purgeTeachersPagination())

    return data
  }
}

export const getTeacher = id => async dispatch => {
  try {
    let url = `/teachers/${id}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch(addTeacher(data))

      return data
    }
  } catch (err) {
    if (err.status === 404) {
      dispatch(removeTeacher(id))
    } else {
      console.error(err)
    }
  }
}

export const updateTeacher = (TeacherId, teacherData) => async dispatch => {
  const { data, error } = await api(`/teachers/${TeacherId}`, {
    method: 'PATCH',
    body: teacherData
  })

  if (error) throw error

  dispatch({ type: TEACHER_UPDATE, data })
  dispatch(purgeTeachersPagination())

  return data
}

export const approveTeacher = id => async dispatch => {
  try {
    const { data, error } = await api(`/teachers/${id}/approve`, {
      method: 'POST'
    })

    if (error) throw error

    dispatch({ type: TEACHER_UPDATE, data })
    dispatch(purgeTeachersPagination())
  } catch (err) {
    throw err
  }
}

export const deleteTeacher = id => async dispatch => {
  try {
    const { error } = await api(`/teachers/${id}`, {
      method: 'DELETE'
    })

    if (error) throw error

    dispatch(removeTeacher(id))
    dispatch(purgeTeachersPagination())
  } catch (err) {
    throw err
  }
}

export const getTerms = (TeacherId, { query = '' } = {}) => async dispatch => {
  try {
    let url = `/teachers/${TeacherId}/terms`
    if (query) url += `?${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: TERM_ADD_BULK_BY_TEACHERID, data })

    return data
  } catch (err) {
    throw err
  }
}

export const getCoursesForTerm = (
  TeacherId,
  TermId,
  { query = '' } = {}
) => async dispatch => {
  try {
    let url = `/teachers/${TeacherId}/terms/${TermId}/courses`
    if (query) url += `?${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: COURSES_ADD_BULK_FOR_TEACHER_TERM, data })

    return data
  } catch (err) {
    throw err
  }
}

export const getClassTestMarks = (
  TeacherId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/theory/classtest`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_CLASSTEST_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const updateClassTestMarks = (
  TeacherId,
  TermId,
  CourseId,
  classTestMarksData
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/theory/classtest`

  const { data, error } = await api(url, {
    method: 'POST',
    body: classTestMarksData
  })

  if (error) throw error

  dispatch({ type: MARKS_CLASSTEST_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const getTheoryMarks = (
  TeacherId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/theory`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_THEORY_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const updateTheoryMarks = (
  TeacherId,
  TermId,
  CourseId,
  theoryMarksData
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/theory`

  const { data, error } = await api(url, {
    method: 'POST',
    body: theoryMarksData
  })

  if (error) throw error

  dispatch({ type: MARKS_THEORY_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const getSessionalMarks = (
  TeacherId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/sessional`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_SESSIONAL_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const updateSessionalMarks = (
  TeacherId,
  TermId,
  CourseId,
  sessionalMarksData
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/sessional`

  const { data, error } = await api(url, {
    method: 'POST',
    body: sessionalMarksData
  })

  if (error) throw error

  dispatch({ type: MARKS_SESSIONAL_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const getResearchMarks = (
  TeacherId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/research`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_RESEARCH_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const updateResearchMarks = (
  TeacherId,
  TermId,
  CourseId,
  researchMarksData
) => async dispatch => {
  const url = `/teachers/${TeacherId}/terms/${TermId}/courses/${CourseId}/marks/research`

  const { data, error } = await api(url, {
    method: 'POST',
    body: researchMarksData
  })

  if (error) throw error

  dispatch({ type: MARKS_RESEARCH_ADD_BULK_BY_TEACHER_TERM_COURSE, data })

  return data
}

export const fetchTeachersPage = (
  { page = 1, query = '' } = {},
  storeItems = true
) => async dispatch => {
  try {
    dispatch({ type: TEACHERS_REQUEST_PAGE, page, query })

    let url = `/teachers?page=${page}`
    if (query) url += `&${query}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      if (storeItems) dispatch({ type: TEACHER_ADD_BULK, data })

      dispatch({ type: TEACHERS_ADD_PAGE, page, data, query })

      return data
    }
  } catch (err) {
    dispatch({ type: TEACHERS_REMOVE_PAGE, page, err, query })
    throw err
  }
}

export const fetchAllTeachersPage = (
  { query = '' } = {},
  storeItems = true
) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    try {
      const { nextLink = null, pageIndex } = await dispatch(
        fetchTeachersPage({ page, query }, storeItems)
      )

      hasNext = nextLink
      page = pageIndex + 1
    } catch (err) {
      throw err
    }
  }

  return true
}

export const setTeacherAsHead = TeacherId => async dispatch => {
  const { data, error } = await api(`/teachers/action/set-head`, {
    method: 'POST',
    body: { TeacherId }
  })

  if (error) throw error

  dispatch({ type: TEACHER_UPDATE, data })
  dispatch(purgeTeachersPagination())
}
