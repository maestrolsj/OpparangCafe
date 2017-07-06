
'use strict';

const initialState = {
  isLogin: false   // state key-value
}

function navigationState (state = initialState, action) {

  switch (action.type) {
    case 'IS_LOGIN':
      return {
        ...state,
        isLogin: action.value,
      }
    default:
      return state
  }
}

export default navigationState
