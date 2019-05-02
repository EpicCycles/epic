import api from '../api';

const saveBrands = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const brands = payload.brands;
  const brandsApi = '/api/brands/';
  return await api.instance.post(brandsApi, brands);
};

const getBrands = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const brandsApi = '/api/brands';
  return await api.instance.get(brandsApi);
};

export default {
  getBrands,
  saveBrands,
};
