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
const getCustomerList = async (payload) => {
    console.log(payload)
    const api = `/api/customer?firstName=${payload.firstName}&lastName=${payload.lastName}&email=${payload.email}`;
    return await instance.get(api);
};

const getNoteList = async (payload) => {
    const api = `/api/customernote?customerId=${payload.customerId}&quoteId=${payload.quoteId}&customerVisible=${payload.customerVisible}`;
    return await instance.get(api);
};

const getCustomer = async customerId => {
    return await instance.get(`/api/customer/${customerId}`);
};

const saveCustomer = async payload => {
    const customer = payload;
    return await instance.post(`/api/customer/${customer.id}`, customer);
};

const createNote = async (payload) => {
    const api = `/api/customernote/`;
    return await instance.post(api, payload);
};
const saveNote = async (payload) => {
    const note = payload;
    const api = `/api/customernote/${note.id}`;
    return await instance.post(api, note);
};
const deleteNote = async (payload) => {
    const api = `/api/customernote/${payload}`;
    return await instance.delete(api);
};


export default {loginUser, getCustomerList, getCustomer, saveCustomer, getNoteList, createNote, saveNote, deleteNote};
