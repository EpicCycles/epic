import api from '../api';

const saveFrame = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.patch(`api/frames/${payload.frame.id}`, payload.frame);
};

const uploadFrame = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.post("api/frame/upload/", payload.frame);
};

const getFrames = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const frameApi = `/api/frames?brand=${payload.brand}&frameName=${payload.frameName}&archived=${payload.archived}`;
    return await api.instance.get(frameApi);
};

export default {
    uploadFrame,
    getFrames,
    saveFrame,
}
