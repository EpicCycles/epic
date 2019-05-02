import api from '../api';

const createAttributeOption = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const option = payload.option;
    return await api.instance.post(`/api/attributeoptions/`, option);
};
const saveAttributeOption = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const option = payload.option;
    return await api.instance.post(`/api/attributeoptions/${option.id}`, option);
};
const deleteAttributeOption = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const optionId = payload.optionId;
    return await api.instance.delete(`/api/attributeoptions/${optionId}`);
};

export default {
    createAttributeOption,
    saveAttributeOption,
    deleteAttributeOption,
}