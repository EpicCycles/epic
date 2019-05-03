import api from '../api';

const createSupplier = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const supplier = payload.supplier;
  const suppliersApi = '/rest-epic/suppliers';
  return await api.instance.post(suppliersApi, supplier);
};
const getSupplier = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  return await api.instance.get(`/rest-epic/supplier/${payload.supplierId}`);
};
const deleteSupplier = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  return await api.instance.delete(`/rest-epic/supplier/${payload.supplierId}`);
};
const saveSupplier = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const supplier = payload.supplier;
  const supplierApi = `/rest-epic/supplier/${payload.supplier.id}`;
  return await api.instance.post(supplierApi, supplier);
};

const getSuppliers = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const suppliersApi = '/rest-epic/suppliers';
  return await api.instance.get(suppliersApi);
};

export default {
  getSuppliers,
  createSupplier,
  saveSupplier,
  deleteSupplier,
  getSupplier,
};
