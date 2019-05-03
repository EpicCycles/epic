import api from '../api';

const createPartTypeAttribute = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const partTypeAttribute = payload.partTypeAttribute;
  return await api.instance.post('/rest-epic/parttypeattribute', partTypeAttribute);
};
const savePartTypeAttribute = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const partTypeAttribute = payload.partTypeAttribute;
  return await api.instance.post(
    `/rest-epic/parttypeattribute/${partTypeAttribute.id}`,
    partTypeAttribute,
  );
};
const deletePartTypeAttribute = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const partTypeAttributeId = payload.partTypeAttributeId;
  return await api.instance.delete(`/rest-epic/parttypeattribute/${partTypeAttributeId}`);
};

export default {
  createPartTypeAttribute,
  savePartTypeAttribute,
  deletePartTypeAttribute,
};
