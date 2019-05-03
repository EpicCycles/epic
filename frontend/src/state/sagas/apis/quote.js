import api from '../api';
import { buildSearchCriteria } from './utils/list';

const createQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quote = payload.quote;
  return await api.instance.post('/rest-epic/quotes', quote);
};
const copyQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quoteId;
  const newQuoteData = payload.newQuoteData;
  return await api.instance.post(`/rest-epic/quote/${quoteId}/copy`, newQuoteData);
};
const archiveQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quoteId;
  return await api.instance.post(`/rest-epic/quote/${quoteId}/archive`);
};
const unarchiveQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quoteId;
  return api.instance.post(`/rest-epic/quote/${quoteId}/unarchive`);
};
const recalculateQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quoteId;
  return api.instance.post(`/rest-epic/quote/${quoteId}/recalculate`);
};
const issueQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quoteId;
  return api.instance.post(`/rest-epic/quote/${quoteId}/issue`);
};
const saveQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quote.id;
  const quoteData = payload.quote;
  return api.instance.put(`/rest-epic/quote/${quoteId}`, quoteData);
};
const getQuote = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quoteId = payload.quoteId;
  return api.instance.get(`/rest-epic/quote/${quoteId}`);
};
const getQuoteList = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const searchCriteria = payload.searchCriteria;
  const fullApiString = `/rest-epic/quotes${buildSearchCriteria(searchCriteria)}`;
  return api.instance.get(fullApiString);
};
const createQuotePart = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quotePart = payload.quotePart;
  return api.instance.post('/rest-epic/quote-part', quotePart);
};
const updateQuotePart = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quotePart = payload.quotePart;
  return api.instance.patch(`/rest-epic/quote-part/${quotePart.id}`, quotePart);
};
const deleteQuotePart = async payload => {
  api.instance.defaults.headers.common.Authorization = `Token ${payload.token}`;
  const quotePartId = payload.quotePartId;
  return api.instance.delete(`/rest-epic/quote-part/${quotePartId}`);
};
export default {
  createQuote,
  copyQuote,
  getQuote,
  getQuoteList,
  saveQuote,
  archiveQuote,
  unarchiveQuote,
  createQuotePart,
  updateQuotePart,
  deleteQuotePart,
  recalculateQuote,
  issueQuote,
};
