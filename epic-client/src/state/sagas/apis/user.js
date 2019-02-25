import api from '../api';

// from https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html#basic

const loginUser = async (payload) => {
    const loginApi = `/rest-auth/login/`;
    return await api.instance.post(loginApi, payload);
};


const getUserToken = async (payload) => {
    const tokenApi = `/rest-auth/api-token-auth/`;
    return await api.instance.post(tokenApi, payload);
};

const getUser = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const getUserApi = `rest-auth/user/`;
    return await api.instance.get(getUserApi);
};

const logoutUser = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const logoutApi = `/rest-auth/logout/ `;
    return await api.instance.post(logoutApi);
};

const changePassword = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const changePasswordApi = `rest-auth/password/change/`;
    return await api.instance.post(changePasswordApi, payload.passwordData);
};

const changeUserData = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const changeUserDataApi = `rest-auth/user/`;
    return await api.instance.patch(changeUserDataApi, payload.user);
};
export default {
    loginUser,
    getUserToken,
    getUser,
    logoutUser,
    changePassword,
    changeUserData,
}