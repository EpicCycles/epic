import api from '../api';

const getFramework = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const frameworkApi = '/api/framework';
    return await api.instance.get(frameworkApi);
};
const saveFramework = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const frameworkApi = '/api/framework';
    return await api.instance.post(frameworkApi, payload.sections);
};

export default {
    getFramework,
    saveFramework,
}