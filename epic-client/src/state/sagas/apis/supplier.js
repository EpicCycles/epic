import api from '../api';

const saveSuppliers = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const suppliers = payload.Suppliers;
    const suppliersApi = '/api/suppliers';
    return await api.instance.post(suppliersApi, suppliers);
};

const getSuppliers = async (payload) => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const suppliersApi = '/api/suppliers';
    return await api.instance.get(suppliersApi);
};

export default {
    getSuppliers,
    saveSuppliers
}