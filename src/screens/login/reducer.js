import * as actionType from './constants.js'

const initialState = {
  isLoading: false,
  isError: false,
  errorMsg: null,
  posts: [],
  isLogin: 0
}

const loginRequest = state => ({
  ...state,
  isLoading: true,
})

const loginSuccess = (state, payload) => ({
  ...state,
  isLoading: false,
  posts: payload,
})

const loginError = (state, payload) => ({
  ...state,
  isLoading: false,
  isError: true,
  errorMsg: payload,
})

const loginStatus = (state, payload) => ({
  ...state,
  isLogin: payload
})

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.LOGIN_STATUS:
      return loginStatus(state, action.payload)
    case actionType.LOGIN_REQUEST:
      return loginRequest(state, action.payload)
    case actionType.LOGIN_SUCCESS:
      return loginSuccess(state, action.payload)
    case actionType.LOGIN_ERROR:
      return loginError(state, action.payload)
    default:
      return state
  }
}

export default loginReducer