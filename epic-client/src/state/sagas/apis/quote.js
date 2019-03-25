import api from "../api";

const createQuote = async payload => {
    api.instance.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
    const quote = payload.quote;
    return await api.instance.post(`/api/quotes/`, quote);
};

export default {
    createQuote,
}