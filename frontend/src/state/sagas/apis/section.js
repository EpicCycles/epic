import api from '../api';

const createPartSection = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const partSection = payload.partSection;
    return await api.instance.post(`/api/partsection/`, partSection);
};
const savePartSection = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const partSection = payload.partSection;
    return await api.instance.post(`/api/partsection/${partSection.id}`, partSection);
};
const deletePartSection = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const partSectionId = payload.partSectionId;
    return await api.instance.delete(`/api/partsection/${partSectionId}`);
};

export default {
    createPartSection,
    savePartSection,
    deletePartSection,
}