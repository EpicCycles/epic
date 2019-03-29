export const CREATE_QUOTE = 'quote/QUOTE_CREATE';
export const COPY_QUOTE = 'quote/QUOTE_COPY';
export const FIND_QUOTES = 'quote/QUOTE_SEARCH';
export const GET_QUOTE = 'quote/QUOTE_FETCH';
export const CLEAR_QUOTE_DATA = 'quote/QUOTE_CLEAR';

export const clearQuoteState = () =>  ({
    type: CLEAR_QUOTE_DATA,
});

export const createQuote = (quote) => ({
    type: `${CREATE_QUOTE}_REQUESTED`,
    payload: { quote }
});
export const createQuoteOK = (responseData) => ({
    type:  `${CREATE_QUOTE}_OK`,
    payload: responseData
});
export const createQuoteError = (error) => ({
    type: `${CREATE_QUOTE}_ERROR`,
    payload: error
});

export const getQuote = (quoteId) => ({
    type: `${GET_QUOTE}_REQUESTED`,
    payload: { quoteId }
});
export const getQuoteOK = (responseData) => ({
    type:  `${GET_QUOTE}_OK`,
    payload: responseData
});
export const getQuoteError = (error) => ({
    type: `${GET_QUOTE}_ERROR`,
    payload: error
});

export const getQuoteList = (searchCriteria) => ({
    type: `${FIND_QUOTES}_REQUESTED`,
    payload: { searchCriteria }
});
export const getQuoteListOK = (responseData) => ({
    type:  `${FIND_QUOTES}_OK`,
    payload: responseData
});
export const getQuoteListError = (error) => ({
    type: `${FIND_QUOTES}_ERROR`,
    payload: error
});

export const copyQuote = (quoteId, newQuoteData ) => ({
    type: `${COPY_QUOTE}_REQUESTED`,
    payload: { quoteId, newQuoteData }
});
export const copyQuoteOK = (responseData) => ({
    type:  `${COPY_QUOTE}_OK`,
    payload: responseData
});
export const copyQuoteError = (error) => ({
    type: `${COPY_QUOTE}_ERROR`,
    payload: error
});
