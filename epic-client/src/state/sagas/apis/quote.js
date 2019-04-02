import api from "../api";
import {buildSearchCriteria} from "./utils/list";

const createQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quote = payload.quote;
    return await api.instance.post(`/api/quotes/`, quote);
};
const copyQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quoteId = payload.quoteId;
    const newQuoteData = payload.newQuoteData;
    return await api.instance.post(`/api/quote/${quoteId}/copy/`, newQuoteData);
};
const archiveQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quoteId = payload.quoteId;
    return await api.instance.post(`/api/quote/${quoteId}/archive/`);
};
const unarchiveQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quoteId = payload.quoteId;
    return await api.instance.post(`/api/quote/${quoteId}/unarchive/`);
};
const saveQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quoteId = payload.quote.id;
    const quoteData = payload.quote;
    return await api.instance.put(`/api/quote/${quoteId}`, quoteData);
};
const getQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quoteId = payload.quoteId;
    return await api.instance.get(`/api/quote/${quoteId}`);
};
const getQuoteList = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const searchCriteria = payload.searchCriteria;
    const fullApiString = `/api/quotes/${buildSearchCriteria(searchCriteria)}`
    return await api.instance.get(fullApiString);
};

export default {
    createQuote,
    copyQuote,
    getQuote,
    getQuoteList,
    saveQuote,
    archiveQuote,
    unarchiveQuote,
}