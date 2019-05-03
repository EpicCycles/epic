import axios from 'axios';

const instance = axios.create({
  baseURL: '',
  timeout: 100000,
  headers: { 'Content-Type': 'application/json' },
});

// "Authorization: Token 5e2effff34c85c11a8720a597b96d73a4634c9ad"
const getCustomerList = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const api = `/rest-epic/customers?firstName=${payload.firstName}&lastName=${
    payload.lastName
  }&email=${payload.email}&page=${payload.page}`;
  return instance.get(api);
};

const getNoteList = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const api = `/rest-epic/customernotes?customerId=${payload.customerId}&quoteId=${
    payload.quoteId
  }&customerVisible=${payload.customerVisible}`;
  return instance.get(api);
};

const getCustomer = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  return instance.get(`/rest-epic/customer/${payload.customerId}`);
};

const createCustomer = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customer = payload.customer;
  return instance.post('/rest-epic/customer', customer);
};
const saveCustomer = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customer = payload.customer;
  return instance.post(`/rest-epic/customer/${customer.id}`, customer);
};
const deleteCustomer = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customerId = payload.customerId;
  return instance.delete(`/rest-epic/customer/${customerId}`);
};
const createCustomerPhone = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customerPhone = payload.customerPhone;
  return instance.post('/rest-epic/customerphone', customerPhone);
};
const saveCustomerPhone = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customerphone = payload.customerPhone;
  return instance.post(`/rest-epic/customerphone/${customerphone.id}`, customerphone);
};
const deleteCustomerPhone = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customerPhoneId = payload.customerPhoneId;
  return instance.delete(`/rest-epic/customerphone/${customerPhoneId}`);
};
const createCustomerAddress = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customerAddress = payload.customerAddress;
  return instance.post('/rest-epic/customeraddress', customerAddress);
};
const saveCustomerAddress = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customeraddress = payload.customerAddress;
  return instance.post(`/rest-epic/customeraddress/${customeraddress.id}`, customeraddress);
};
const deleteCustomerAddress = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const customerAddressId = payload.customerAddressId;
  return instance.delete(`/rest-epic/customeraddress/${customerAddressId}`);
};

const createNote = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const note = payload.note;
  const api = '/rest-epic/customernote';
  return instance.post(api, note);
};
const saveNote = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const note = payload.note;
  const api = `/rest-epic/customernote/${note.id}`;
  return instance.post(api, note);
};
const deleteNote = async payload => {
  instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const noteId = payload.noteId;
  const api = `/rest-epic/customernote/${noteId}`;
  return instance.delete(api);
};

export default {
  createCustomer,
  deleteCustomer,
  getCustomerList,
  getCustomer,
  saveCustomer,
  createCustomerPhone,
  saveCustomerPhone,
  deleteCustomerPhone,
  createCustomerAddress,
  saveCustomerAddress,
  deleteCustomerAddress,
  getNoteList,
  createNote,
  saveNote,
  deleteNote,
  instance,
};
