import api from '../../utils/api.js'

import {
  CURRENT_USER_REQUEST_LOGIN,
  CURRENT_USER_LOGIN,
  CURRENT_USER_LOGOUT
} from './actionTypes'

export const logIn = loginData => async dispatch => {
  try {
    dispatch({ type: CURRENT_USER_REQUEST_LOGIN })

    const { data, error } = await api('/auth/login', {
      method: 'POST',
      body: loginData
    })

    if (error) throw error

    dispatch({ type: CURRENT_USER_LOGIN, data })

    return data
  } catch (err) {
    dispatch({ type: CURRENT_USER_LOGOUT })
    throw err
  }
}

export const logOut = () => async dispatch => {
  try {
    const response = await api('/auth/logout', {
      method: 'POST'
    })

    dispatch({ type: CURRENT_USER_LOGOUT })

    return response
  } catch (err) {
    throw err
  }
}

export const checkAuthStatus = () => async dispatch => {
  try {
    const { data } = await api('/user')

    if (data) {
      dispatch({ type: CURRENT_USER_LOGIN, data })
      return data
    }

    dispatch({ type: CURRENT_USER_LOGOUT })
  } catch (err) {
    throw err
  }
}

export const updatePassword = passwordData => async dispatch => {
  const { error } = await api('/user/password', {
    method: 'POST',
    body: passwordData
  })

  if (error) throw error
}
