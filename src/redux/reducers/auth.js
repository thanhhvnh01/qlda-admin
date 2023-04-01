import { ACTION_TYPES } from '../actionsTypes';

// **  Initial State
const initialState = {
  isCheckingRememberedUser: true,
  isUserLoggedIn: false,
  refreshToken: false,
  userData: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHECK_REMENBERED_USER_DONE:
      return {
        ...state,
        isCheckingRememberedUser: false,
        isUserLoggedIn: action.data.isUserLoggedIn,
        userData: action.data.user,
      };
    case ACTION_TYPES.LOGIN:
      return {
        ...state,
        isUserLoggedIn: true,
        userData: action.data.user,
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        isUserLoggedIn: false,
        userData: null,
      };
    case ACTION_TYPES.REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: !state.refreshToken,
      };
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        userData: action.data.user,
      };
    default:
      return state;
  }
};

export default authReducer;
