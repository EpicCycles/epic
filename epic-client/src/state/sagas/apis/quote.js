import api from "../api";

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
const getQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quoteId = payload.quoteId;
    return await api.instance.get(`/api/quote/${quoteId}`);
};
const getQuoteList = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const searchCriteria = payload.searchCriteria;
    return await api.instance.get(`/api/quotes/`, searchCriteria);
};

export default {
    createQuote,
    copyQuote,
    getQuote,
    getQuoteList,
}