import { getUserInfoAPI, refreshToken } from '@api/main';
import { Storage, STORAGE_KEYS } from 'src/utilities/storage';
import { ACTION_TYPES } from '@store/actionsTypes';
// import { getDeviceToken, deleteDeviceToken } from '@configs/firebaseConfig'

// ** Handle User Login
export const loginAC = (data) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_TYPES.LOGIN,
      data,
    });

    // ** Add to user, accessToken & refreshToken to localStorage
    Storage.setItem(STORAGE_KEYS.userData, data.user);
    Storage.setItem(STORAGE_KEYS.token, data.token);

    // Get device token
    // getDeviceToken()
  };
};

/**
 * Handle User Logout
 * @param {boolean} isSessionExpired
 */
export const logoutAC = () => {
  return (dispatch) => {
    dispatch({ type: ACTION_TYPES.LOGOUT });

    // ** Remove user, accessToken & refreshToken from localStorage
    Storage.clear(STORAGE_KEYS.userData);
    Storage.clear(STORAGE_KEYS.token);

    // Delete device token
    // deleteDeviceToken()
  };
};

/**
 * Handle Check Refresh Token
 */
export const refreshTokenAC = () => {
  return (dispatch) => {
    dispatch({ type: ACTION_TYPES.REFRESH_TOKEN });
  };
};

// ** Check remenbered user
export const checkRememberedUserAC = () => {
  return async (dispatch) => {
    try {
      if (!!Storage.getItem(STORAGE_KEYS.userData) && !!Storage.getItem(STORAGE_KEYS.token)) {
        await refreshToken();
        dispatch({
          type: ACTION_TYPES.CHECK_REMENBERED_USER_DONE,
          data: {
            isUserLoggedIn: true,
            user: Storage.getItem(STORAGE_KEYS.userData),
          },
        });
      } else {
        dispatch({
          type: ACTION_TYPES.CHECK_REMENBERED_USER_DONE,
          data: {
            isUserLoggedIn: false,
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.CHECK_REMENBERED_USER_DONE,
        data: {
          isUserLoggedIn: false,
          user: null,
        },
      });
    }
  };
};

export const getUserInfoAC = () => {
  return async (dispatch) => {
    try {
      const userRes = await getUserInfoAPI();

      dispatch({
        type: ACTION_TYPES.UPDATE_USER,
        data: {
          user: { ...userRes.data },
        },
      });
      Storage.setItem(STORAGE_KEYS.userData, {
        ...userRes.data,
      });
    } catch (error) {}
  };
};
