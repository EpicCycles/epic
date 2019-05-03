import api from '../api';

const createAttributeOption = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const option = payload.option;
  return await api.instance.post('/rest-epic/attributeoptions', option);
};
const saveAttributeOption = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const option = payload.option;
  return await api.instance.post(`/rest-epic/attributeoptions/${option.id}`, option);
};
const deleteAttributeOption = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const optionId = payload.optionId;
  return await api.instance.delete(`/rest-epic/attributeoptions/${optionId}`);
};

export default {
  createAttributeOption,
  saveAttributeOption,
  deleteAttributeOption,
};
