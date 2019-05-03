import api from '../api';

// from https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html#basic

export const loginUser = async payload => {
  api.instance.defaults.headers.common.Authorization = '';
  const loginApi = 'rest-epic/api-token-auth';
  return await api.instance.post(loginApi, payload);
};

export const getUsers = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const getUserApi = 'rest-epic/user';
  return await api.instance.get(getUserApi);
};

export const logoutUser = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const logoutApi = '/rest-auth/logout ';
  return await api.instance.post(logoutApi);
};

export const changePassword = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const changePasswordApi = 'rest-auth/password/change';
  return await api.instance.post(changePasswordApi, payload.passwordData);
};

export const changeUserData = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const changeUserDataApi = 'rest-auth/user';
  return await api.instance.patch(changeUserDataApi, payload.user);
};
