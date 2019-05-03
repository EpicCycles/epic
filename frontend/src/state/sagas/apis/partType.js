import api from '../api';

const createPartType = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const partType = payload.partType;
  return await api.instance.post('/rest-epic/parttype', partType);
};
const savePartType = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const partType = payload.partType;
  return await api.instance.post(`/rest-epic/parttype/${partType.id}`, partType);
};
const deletePartType = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const partTypeId = payload.partTypeId;
  return await api.instance.delete(`/rest-epic/parttype/${partTypeId}`);
};

export default {
  createPartType,
  savePartType,
  deletePartType,
};
