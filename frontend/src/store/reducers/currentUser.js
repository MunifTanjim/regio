import {
  CURRENT_USER_REQUEST_LOGIN,
  CURRENT_USER_LOGIN,
  CURRENT_USER_LOGOUT
} from '../actions/actionTypes.js'

const initialState = {
  data: null,
  status: {
    authed: false,
    loading: true
  }
}

const currentUserReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case CURRENT_USER_REQUEST_LOGIN:
      return {
        data: null,
        status: {
          authed: false,
          loading: true
        }
      }
    case CURRENT_USER_LOGIN:
      return {
        data: {
          ...data
        },
        status: {
          authed: true,
          loading: false
        }
      }
    case CURRENT_USER_LOGOUT:
      return {
        data: null,
        status: {
          authed: false,
          loading: false
        }
      }
    default:
      return state
  }
}

export default currentUserReducer
