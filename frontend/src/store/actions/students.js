import api from '../../utils/api.js'

import {
  STUDENT_ADD,
  STUDENT_ADD_BULK,
  STUDENT_REMOVE,
  STUDENT_UPDATE,
  STUDENTS_ADD_PAGE,
  STUDENTS_REMOVE_PAGE,
  STUDENTS_REQUEST_PAGE,
  STUDENTS_PURGE_PAGINATION,
  ENROLLMENT_ADD_BULK_BY_STUDENTID,
  ENROLLMENTS_APPROVE_BY_STUDENTID_TERMID,
  ATTENDANCE_ADD_FOR_STUDENT_BY_TERM_COURSE,
  MARKS_CLASSTEST_ADD_BULK_BY_STUDENT_TERM_COURSE,
  STUDENT_ADVISER_SET,
  MARKS_THEORY_ADD_BY_STUDENT_TERM_COURSE,
  ENROLLMENT_ADD_BY_STUDENT_TERM_COURSE,
  MARKS_SESSIONAL_ADD_BY_STUDENT_TERM_COURSE,
  MARKS_RESEARCH_ADD_BY_STUDENT_TERM_COURSE
} from './actionTypes.js'

export const addStudent = data => ({
  type: STUDENT_ADD,
  data
})

export const removeStudent = id => ({
  type: STUDENT_REMOVE,
  id
})

export const purgeStudentsPagination = () => ({
  type: STUDENTS_PURGE_PAGINATION
})

export const createStudent = studentData => async dispatch => {
  try {
    const { data, error } = await api('/students', {
      method: 'POST',
      body: studentData
    })

    if (error) throw error

    if (data) {
      dispatch(addStudent(data))
      dispatch(purgeStudentsPagination())

      return data
    }
  } catch (err) {
    throw err
  }
}

export const getStudent = StudentId => async dispatch => {
  try {
    let url = `/students/${StudentId}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      dispatch(addStudent(data))

      return data
    }
  } catch (err) {
    if (err.status === 404) {
      dispatch(removeStudent(StudentId))
    } else {
      console.error(err)
    }
  }
}

export const updateStudent = (StudentId, studentData) => async dispatch => {
  const { data, error } = await api(`/students/${StudentId}`, {
    method: 'PATCH',
    body: studentData
  })

  if (error) throw error

  dispatch({ type: STUDENT_UPDATE, data })
  dispatch(purgeStudentsPagination())

  return data
}

export const approveStudent = StudentId => async dispatch => {
  try {
    const { data, error } = await api(`/students/${StudentId}/approve`, {
      method: 'POST'
    })

    if (error) throw error

    dispatch({ type: STUDENT_UPDATE, data })
    dispatch(purgeStudentsPagination())
  } catch (err) {
    throw err
  }
}

export const deleteStudent = StudentId => async dispatch => {
  try {
    const { error } = await api(`/students/${StudentId}`, {
      method: 'DELETE'
    })

    if (error) throw error

    dispatch(removeStudent(StudentId))
    dispatch(purgeStudentsPagination())
  } catch (err) {
    throw err
  }
}

export const setAdviser = (StudentId, adviserData) => async dispatch => {
  const { data, error } = await api(`/students/${StudentId}/adviser`, {
    method: 'POST',
    body: adviserData
  })

  if (error) throw error

  dispatch({ type: STUDENT_ADVISER_SET, data })

  return data
}

export const getAttendancesForStudent = (
  StudentId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/attendances`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: ATTENDANCE_ADD_FOR_STUDENT_BY_TERM_COURSE, data })

  return data
}

export const getClassTestMarksForStudent = (
  StudentId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/marks/theory/classtest`

  const { data, error } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_CLASSTEST_ADD_BULK_BY_STUDENT_TERM_COURSE, data })

  return data
}

export const getResearchMarkForStudent = (
  StudentId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/marks/research`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_RESEARCH_ADD_BY_STUDENT_TERM_COURSE, data, params })

  return data
}

export const getSessionalMarkForStudent = (
  StudentId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/marks/sessional`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_SESSIONAL_ADD_BY_STUDENT_TERM_COURSE, data, params })

  return data
}

export const getTheoryMarkForStudent = (
  StudentId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/marks/theory`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: MARKS_THEORY_ADD_BY_STUDENT_TERM_COURSE, data, params })

  return data
}

export const getTermCourseEnrollment = (
  StudentId,
  TermId,
  CourseId
) => async dispatch => {
  const url = `/students/${StudentId}/terms/${TermId}/courses/${CourseId}/enrollment`

  const { data, error, params } = await api(url)

  if (error) throw error

  dispatch({ type: ENROLLMENT_ADD_BY_STUDENT_TERM_COURSE, data, params })

  return data
}

export const getEnrollments = (
  StudentId,
  { query = '' } = {}
) => async dispatch => {
  try {
    let url = `/students/${StudentId}/enrollments`
    if (query) url += `?${query}`

    const { data, error } = await api(url)

    if (error) throw error

    dispatch({ type: ENROLLMENT_ADD_BULK_BY_STUDENTID, data })

    return data
  } catch (err) {
    throw err
  }
}

export const setEnrollments = (StudentId, enrollmentData) => async dispatch => {
  try {
    let url = `/students/${StudentId}/enrollments`

    const { data, error } = await api(url, {
      method: 'PUT',
      body: enrollmentData
    })

    if (error) throw error

    dispatch({ type: ENROLLMENT_ADD_BULK_BY_STUDENTID, data })

    return data
  } catch (err) {
    throw err
  }
}

export const approveTermEnrollments = (StudentId, TermId) => async dispatch => {
  try {
    const url = `/students/${StudentId}/terms/${TermId}/do/approve`

    const { data, error } = await api(url, {
      method: 'POST'
    })

    if (error) throw error

    dispatch({ type: ENROLLMENTS_APPROVE_BY_STUDENTID_TERMID, data })

    return data
  } catch (err) {
    throw err
  }
}

export const fetchStudentsPage = (
  { page = 1, query = '' } = {},
  storeItems = true
) => async dispatch => {
  try {
    dispatch({ type: STUDENTS_REQUEST_PAGE, page, query })

    let url = `/students?page=${page}`
    if (query) url += `&${query}`

    const { data, error } = await api(url)

    if (error) throw error

    if (data) {
      if (storeItems) dispatch({ type: STUDENT_ADD_BULK, data })

      dispatch({ type: STUDENTS_ADD_PAGE, page, data, query })

      return data
    }
  } catch (err) {
    dispatch({ type: STUDENTS_REMOVE_PAGE, page, err, query })
    throw err
  }
}

export const fetchAllStudentsPage = (
  { query = '' } = {},
  storeItems = true
) => async dispatch => {
  let page = 1
  let hasNext = true

  while (hasNext) {
    try {
      const { nextLink = null, pageIndex } = await dispatch(
        fetchStudentsPage({ page, query }, storeItems)
      )

      hasNext = nextLink
      page = pageIndex + 1
    } catch (err) {
      throw err
    }
  }

  return true
}
