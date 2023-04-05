import axios, { handleRefreshToken } from './base';

export const getProductsAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/products`);
};

// -----------AUTHENTICATION APIS-----------
export const refreshToken = async () => {
  return handleRefreshToken();
};

export const loginAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data, {
    __auth: false,
  });
};

// -----------USER APIS-----------
export const getUserInfoAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/users/my-profile`);
};

// -----------CATEGORY APIS-----------
export const getCategoriesAPI = async () => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/admin/brands`
  );
};

export const deleteCategoryAPI = async (categoryId) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/categories/${categoryId}`);
};

export const getDetailsCategoryAPI = async (categoryId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/categories/${categoryId}`);
};

export const updateCategoryAPI = async (categoryId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/categories/${categoryId}`, data);
};

export const createCategoryAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/categories`, data);
};

export const setEnabledCategoryAPI = async (categoryId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/categories/${categoryId}/set-enabled`, data);
};

export const getEnabledCategoriesAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/categories/all-enabled?lang=en`);
};

// -----------PRODUCT-TYPE APIS-----------
export const getProductTypesAPI = async (pageSize, pageNumber, keyword = '', data) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/product-types/admin?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}`,
    data
  );
};

export const getDetailsProductTypeAPI = async (productTypeId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/product-types/${productTypeId}`);
};

export const deleteProductTypeAPI = async (productTypeId) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/product-types/${productTypeId}`);
};

export const setEnabledProductTypeAPI = async (productTypeId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/product-types/${productTypeId}/set-enabled`, data);
};

export const createProductTypeAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/product-types`, data);
};

export const updateProductTypeAPI = async (productTypeId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/product-types/${productTypeId}`, data);
};

export const getEnabledProductTypesAPI = async (categoryId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/product-types/all-enabled?categoryId=${categoryId}&lang=en`);
};

// -----------SUPPORTER APIS-----------
export const getSupportersAPI = async (pageSize, pageNumber, keyword = '') => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/supporters/admin?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}`
  );
};

export const createSupporterAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/supporters`, data);
};

export const updateSupporterAPI = async (supporterId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/supporters/${supporterId}`, data);
};

export const getDetailsSupporterAPI = async (supporterId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/supporters/${supporterId}`);
};

export const setEnabledSupporterAPI = async (supporterId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/supporters/${supporterId}/set-enabled`, data);
};

export const deleteSupporterAPI = async (supporterId) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/supporters/${supporterId}`);
};

// -----------COLOR APIS-----------
export const getColorsAPI = async (pageSize, pageNumber, keyword = '') => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/colors/admin?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}`
  );
};

export const setEnabledColorAPI = async (colorId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/colors/${colorId}/set-enabled`, data);
};

export const deleteColorAPI = async (colorId) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/colors/${colorId}`);
};

export const getDetailsColorAPI = async (colorId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/colors/${colorId}`);
};

export const createColorAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/colors`, data);
};

export const updateColorAPI = async (colorId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/colors/${colorId}`, data);
};

export const getEnabledColorsAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/colors/all-enabled?lang=en`);
};

// -----------PRODUCT APIS-----------

export const setEnabledProductAPI = async (productGroupId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/products/${productGroupId}/set-enabled`, data);
};

export const deleteProductAPI = async (productGroupId) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/products/${productGroupId}`);
};

export const getDetailsProductAPI = async (productGroupId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/products/${productGroupId}/admin`);
};

export const createProductAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/products`, data);
};

export const updateProductAPI = async (productId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/products/${productId}`, data);
};

// -----------SUBSCRIBE APIS-----------
export const getSubscribesAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/admin/subscribers`);
};

// -----------NOTIFICATION APIS-----------
export const getNotificationsAPI = async (pageSize, pageNumber, lang) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/notifications?pageSize=${pageSize}&pageNumber=${pageNumber}&lang=${lang}`
  );
};

export const updateNotificationAsReadAPI = async (notifactionId) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/notifications/${notifactionId}/read`);
};

export const updateNotificationReadAllAPI = async () => {
  return axios.put(`${process.env.REACT_APP_API_URL}/notifications/read-all`);
};

export const getAllUnreadNotificationCountAPI = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/notifications/unread-count`);
};

// -----------CONTACT APIS-----------
export const getContactsAPI = async (pageSize, pageNumber) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/contacts?pageSize=${pageSize}&pageNumber=${pageNumber}`);
};

export const getDetailsContactAPI = async (contactId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/contacts/${contactId}`);
};

// -----------PHYSICALFILE APIS-----------
export const createPhysicalFileAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/physical-files/request-upload`, data);
};

export const putUploadImageAPI = async (preSignedURL, data) => {
  return axios.put(`${preSignedURL}`, data, {
    __auth: false,
    upload: data?.type,
  });
};

export const putUploadDoneAPI = async (fileId) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/physical-files/upload-done`, fileId);
};

// -----------COVER APIS-----------
export const getCoversAPI = async () => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/slidebarhome`
  );
};

export const setEnabledCoverAPI = async (coverId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/covers/${coverId}/set-enabled`, data);
};

export const deleteCoverAPI = async (coverId) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/covers/${coverId}`);
};

export const getDetailsCoverAPI = async (coverId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/covers/${coverId}`);
};

export const createCoverAPI = async (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/covers`, data);
};

export const updateCoverAPI = async (coverId, data) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/covers/${coverId}`, data);
};
