import api from '../api';

const createSupplier = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const supplier = payload.supplier;
    const suppliersApi = '/api/suppliers/';
    return await api.instance.post(suppliersApi, supplier);
};
const getSupplier = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.get(`/api/supplier/${payload.supplierId}`);
};
const deleteSupplier = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await api.instance.delete(`/api/supplier/${payload.supplierId}`);
};
const saveSupplier = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const supplier = payload.supplier;
    const supplierApi = `/api/supplier/${payload.supplier.id}`;
    return await api.instance.post(supplierApi, supplier);
};

const getSuppliers = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const suppliersApi = '/api/suppliers';
    return await api.instance.get(suppliersApi);
};

export default {
    getSuppliers,
    createSupplier,
    saveSupplier,
    deleteSupplier,
    getSupplier
}
