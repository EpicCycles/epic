import api from '../api';

const deleteBike = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.delete(`api/bike/${payload.bikeId}/`);
};
const saveBike = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.patch(`api/bike/${payload.bike.id}/`, payload.bike);
};
const getBike = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.get(`api/bike/${payload.bikeId}/`);
};
const getBikeParts = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.get(`api/bike/${payload.bikeId}/parts/`);
};
const saveBikePart = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.put(`api/bike/${payload.bikeId}/parts/${payload.part.id}/`, payload.part);
};
const addBikePart = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.post(`api/bike/${payload.bikeId}/parts/`, payload.part);
};
const deleteBikePart = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.delete(`api/bike/${payload.bikeId}/parts/${payload.partId}`);
};
const saveFrame = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.patch(`api/frames/${payload.frame.id}/`, payload.frame);
};
const deleteFrame = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.delete(`api/frames/${payload.frameId}/`);
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
    getBike,
    deleteBike,
    saveBike,
    getBikeParts,
    saveBikePart,
    deleteBikePart,
    addBikePart,
    deleteFrame,
    uploadFrame,
    getFrames,
    saveFrame,
}
