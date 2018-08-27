import axios from 'axios';


const instance = axios.create({
    baseURL: '',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

const loginUser = async (payload) => {
    const api = `/rest-auth/login/ `;
    const response = await instance.post(api, payload);
    return response;
};
const getUser = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const api = `/api/user/${payload.username} `;
    const response = await instance.get(api);
    return response;
};

// "Authorization: Token 5e2effff34c85c11a8720a597b96d73a4634c9ad"
const getCustomerList = async (payload) => {
    instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const api = `/api/customers?firstName=${payload.firstName}&lastName=${payload.lastName}&email=${payload.email}`;
    const response = await instance.get(api);
    return response;
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
    getNoteList,
    createNote,
    saveNote,
    deleteNote
};
