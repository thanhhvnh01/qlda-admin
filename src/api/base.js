import axios from 'axios';
import { Storage, STORAGE_KEYS } from 'src/utilities/storage';
import { store } from '@store/store';
import { logoutAC, refreshTokenAC } from '@store/actions/auth';

const Axios = axios.create();

const refreshTokenUrl = `${process.env.REACT_APP_API_URL}/auth/refresh-token`;

const defaultConfig = {
  __auth: true,
  upload: false,
  __cors: false,
};

let refreshTokenRequest = null;

const setHeader = (config, key, value) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers[key] = value;
};

const handleRefreshError = (e) => {
  console.log('--- Refresh token failed --- \n', e);
  store.dispatch(logoutAC());
  throw new Error('Session expired');
};

const handleRefreshToken = async () => {
  try {
    const token = Storage.getItem(STORAGE_KEYS.token);
    if (!token?.accessToken || !token?.refreshToken) {
      return handleRefreshError(new Error('No token found'));
    }
    const res = await axios.post(refreshTokenUrl, {
      refreshToken: token.refreshToken,
    });
    if (!!res?.data?.data) {
      const payload = res.data.data;
      Storage.setItem(STORAGE_KEYS.token, payload);
      store.dispatch(refreshTokenAC());
      refreshTokenRequest = null;
      return payload;
    } else {
      refreshTokenRequest = null;
      return handleRefreshError(new Error('Invalid response'));
    }
  } catch (e) {
    refreshTokenRequest = null;
    return handleRefreshError(e);
  }
};

const handleError401 = async (error) => {
  refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : handleRefreshToken();
  const token = await refreshTokenRequest;
  setHeader(error.config, 'Authorization', `Bearer ${token.accessToken}`);
  return Axios.request(error.config);
};

const onRequest = async (config) => {
  config = { ...defaultConfig, ...config };
  if (config.__auth && !config?.headers?.Authorization) {
    const token = Storage.getItem(STORAGE_KEYS.token);
    if (token?.accessToken) {
      setHeader(config, 'Authorization', `Bearer ${token.accessToken}`);
    }
  }
  if (!!config.upload) {
    setHeader(config, 'Content-Type', config.upload);
  }
  if (!!config.__cors) {
    setHeader(config, 'Access-Control-Allow-Headers', 'POST, GET, PUT, DELETE, OPTIONS');
  }
  return config;
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

const onResponse = (response) => {
  return response.data;
};

const onResponseError = (error) => {
  const apiError = {
    message: error.message,
    stack: error.stack,
    httpStatusCode: error.response?.status,
  };
  console.log('Request failed\n', apiError);
  if (error.config) {
    console.log('--- Request config --- \n', error.config);
    apiError.config = error.config;
  }
  if (error.response) {
    const { data, status, ...rest } = error.response;
    if (status === 401) {
      return handleError401(error);
    }
    console.log('--- Response --- \n', rest);
    console.log('--- Response data --- \n', data);
    apiError.response = JSON.parse(JSON.stringify(data));
    if (data?.metadata?.messages) {
      console.log('--- Messages --- \n', data.metadata.messages);
    }
  }
  if (error?.response?.data?.metadata?.messages?.length) {
    error.response.data.metadata.messages = error.response.data.metadata.messages.reduce(
      (result, item) => ({
        ...result,
        [item.code]: item.value,
      }),
      {}
    );
  }
  return Promise.reject(apiError);
};

Axios.interceptors.request.use(onRequest, onRequestError);
Axios.interceptors.response.use(onResponse, onResponseError);

export default Axios;
export { handleRefreshToken };
