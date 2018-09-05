import axios from 'axios';

const instance = axios.create({
    baseURL: '',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

const loginUser = async (payload) => {
    const api = `/rest-auth/login/ `;
    return await instance.post(api, payload);
};
const getUser = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const api = `/api/user/${payload.username}`;
    return await instance.get(api);
};

// "Authorization: Token 5e2effff34c85c11a8720a597b96d73a4634c9ad"
const getCustomerList = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const api = `/api/customers?firstName=${payload.firstName}&lastName=${payload.lastName}&email=${payload.email}&page=${payload.page}`;
    return await instance.get(api);
};

const getNoteList = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const api = `/api/customernotes?customerId=${payload.customerId}&quoteId=${payload.quoteId}&customerVisible=${payload.customerVisible}`;
    return await instance.get(api);
};

const getCustomer = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    return await instance.get(`/api/customer/${payload.customerId}`);
};

const createCustomer = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const customer = payload.customer;
    return await instance.post(`/api/customer/`, customer);
};
const saveCustomer = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const customer = payload.customer;
    return await instance.post(`/api/customer/${customer.id}`, customer);
};
const deleteCustomer = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const customerId = payload.customerId;
    return await instance.delete(`/api/customer/${customerId}`);
};
const getCustomerPhoneList = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const api = `/api/customerphone?customerId=${payload.customerId}`;
    return await instance.get(api);
};
const createCustomerPhone = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const customerPhone = payload.customerPhone;
    return await instance.post(`/api/customerphone/`, customerPhone);
};
const saveCustomerPhone = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const customerphone = payload.customerPhone;
    return await instance.post(`/api/customerphone/${customerphone.id}`, customerphone);
};
const deleteCustomerPhone = async payload => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const customerPhoneId = payload.customerPhoneId;
    return await instance.delete(`/api/customerphone/${customerPhoneId}`);
};

const createNote = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const note = payload.note;
    const api = `/api/customernote/`;
    return await instance.post(api, note);
};
const saveNote = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const note = payload.note;
    const api = `/api/customernote/${note.id}`;
    return await instance.post(api, note);
};
const deleteNote = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const noteId = payload.noteId;
    const api = `/api/customernote/${noteId}`;
    return await instance.delete(api);
};

export default {
    loginUser,
    getUser,
    createCustomer,
    deleteCustomer,
    getCustomerList,
    getCustomer,
    saveCustomer,
    getCustomerPhoneList,
    createCustomerPhone,
    saveCustomerPhone,
    deleteCustomerPhone,
    getNoteList,
    createNote,
    saveNote,
    deleteNote
};
