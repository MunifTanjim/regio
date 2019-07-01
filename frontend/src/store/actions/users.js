import api from 'utils/api.js'
import {
  CURRENT_USER_LOGIN,
  STUDENT_UPDATE,
  TEACHER_UPDATE
} from './actionTypes.js'
import { purgeStudentsPagination, removeStudent } from './students.js'
import { purgeTeachersPagination, removeTeacher } from './teachers.js'

const UserIdPatterns = {
  student: /^\d+$/,
  teacher: /^T\d+$/,
  staff: /^S\d+$/
}

const getEntityIdFromUserId = UserId => UserId.replace(/\D+/g, '')
const detectEntityFromUserId = UserId => {
  for (const [modelName, pattern] of Object.entries(UserIdPatterns)) {
    if (pattern.test(UserId)) return modelName
  }

  throw new Error('Invalid UserId')
}

export const deleteUser = UserId => async dispatch => {
  const url = `/users/${UserId}`

  const { error } = await api(url, {
    method: 'DELETE'
  })

  if (error) throw error

  const id = getEntityIdFromUserId(UserId)

  switch (detectEntityFromUserId(UserId)) {
    case 'student':
      dispatch(removeStudent(id))
      dispatch(purgeStudentsPagination())
      break
    case 'teacher':
      dispatch(removeTeacher(id))
      dispatch(purgeTeachersPagination())
      break
    default:
      break
  }
}

export const createContactInfo = (
  UserId,
  contactInfoData,
  isCurrent = false
) => async dispatch => {
  const url = `/users/${UserId}/contactinfos`

  const { data, error } = await api(url, {
    method: 'POST',
    body: contactInfoData
  })

  if (error) throw error

  if (isCurrent) {
    dispatch({ type: CURRENT_USER_LOGIN, data })
  }

  if (data) {
    switch (detectEntityFromUserId(UserId)) {
      case 'student':
        dispatch({ type: STUDENT_UPDATE, data })
        break
      case 'teacher':
        dispatch({ type: TEACHER_UPDATE, data })
        break
      default:
        break
    }

    return data
  }
}

export const updateContactInfo = (
  UserId,
  ContactInfoId,
  contactInfoData,
  isCurrent = false
) => async dispatch => {
  const url = `/users/${UserId}/contactinfos/${ContactInfoId}`

  const { data, error } = await api(url, {
    method: 'POST',
    body: contactInfoData
  })

  if (error) throw error

  if (isCurrent) {
    dispatch({ type: CURRENT_USER_LOGIN, data })
  }

  if (data) {
    switch (detectEntityFromUserId(UserId)) {
      case 'student':
        dispatch({ type: STUDENT_UPDATE, data })
        break
      case 'teacher':
        dispatch({ type: TEACHER_UPDATE, data })
        break
      default:
        break
    }

    return data
  }
}

export const deleteContactInfo = (
  UserId,
  ContactInfoId,
  isCurrent = false
) => async dispatch => {
  const url = `/users/${UserId}/contactinfos/${ContactInfoId}`

  const { data, error } = await api(url, {
    method: 'DELETE'
  })

  if (error) throw error

  if (isCurrent) {
    dispatch({ type: CURRENT_USER_LOGIN, data })
  }

  if (data) {
    switch (detectEntityFromUserId(UserId)) {
      case 'student':
        dispatch({ type: STUDENT_UPDATE, data })
        break
      case 'teacher':
        dispatch({ type: TEACHER_UPDATE, data })
        break
      default:
        break
    }

    return data
  }
}
