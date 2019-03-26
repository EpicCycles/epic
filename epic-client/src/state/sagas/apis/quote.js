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

export default {
    createQuote,
    copyQuote,
}