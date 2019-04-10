import api from '../api';

const getParts = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const listCriteria = payload.listCriteria;
    const partApi = `api/productsearch/?brand=${listCriteria.brand || ''}&supplier=${listCriteria.supplier || ''}&partName=${listCriteria.partName || ''}&standard=${listCriteria.standard}}&stocked=${listCriteria.stocked}`;
    return await api.instance.get(partApi);
};

const uploadParts = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.post("api/parts/", payload.parts);
};
const savePart = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.patch(`api/parts/${payload.part.id}/`, payload.part);
};
const createPart = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.post(`api/part/`, payload.part);
};
const deletePart = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.delete(`api/parts/${payload.partId}/`);
};

export default {
    getParts,
    uploadParts,
    savePart,
    deletePart,
    createPart,
}