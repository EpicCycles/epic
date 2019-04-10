export const CREATE_QUOTE = 'quote/QUOTE_CREATE';
export const COPY_QUOTE = 'quote/QUOTE_COPY';
export const FIND_QUOTES = 'quote/QUOTE_SEARCH';
export const GET_QUOTE = 'quote/QUOTE_FETCH';
export const CHANGE_QUOTE = 'quote/QUOTE_CHANGE';
export const ARCHIVE_QUOTE = 'quote/QUOTE_ARCHIVE';
export const UNARCHIVE_QUOTE = 'quote/QUOTE_UNARCHIVE';
export const UPDATE_QUOTE = 'quote/QUOTE_PUT';
export const CLEAR_QUOTE_DATA = 'quote/QUOTE_CLEAR';
export const SAVE_QUOTE_PART = 'quote/SAVE_QUOTE_PART';
export const DELETE_QUOTE_PART = 'quote/DELETE_QUOTE_PART';

export const clearQuoteState = () =>  ({
    type: CLEAR_QUOTE_DATA,
});

export const saveQuotePart = (quotePart, part) => ({
    type:`${SAVE_QUOTE_PART}_REQUESTED`,
    payload: {quotePart, part}
});
export const saveQuotePartOK = (quotePart) => ({
    type:  `${SAVE_QUOTE_PART}_OK`,
    payload: {quotePart}
});
export const saveQuotePartError = (payload) => ({
    type: `${SAVE_QUOTE_PART}_ERROR`,
    payload
});
export const deleteQuotePart = (quotePartId) => ({
    type:`${DELETE_QUOTE_PART}_REQUESTED`,
    payload: {quotePartId}
});
export const deleteQuotePartOK = (quotePartId) => ({
    type:  `${DELETE_QUOTE_PART}_OK`,
    payload: {quotePartId}
});
export const deleteQuotePartError = (error) => ({
    type: `${DELETE_QUOTE_PART}_ERROR`,
    payload: error
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
export const changeQuote = (quoteId) => ({
    type: CHANGE_QUOTE,
    payload: { quoteId }
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

export const archiveQuote = (quoteId) => ({
    type: `${ARCHIVE_QUOTE}_REQUESTED`,
    payload: { quoteId }
});
export const archiveQuoteOK = (responseData) => ({
    type:  `${ARCHIVE_QUOTE}_OK`,
    payload: responseData
});
export const archiveQuoteError = (error) => ({
    type: `${ARCHIVE_QUOTE}_ERROR`,
    payload: error
});

export const unarchiveQuote = (quoteId) => ({
    type: `${UNARCHIVE_QUOTE}_REQUESTED`,
    payload: { quoteId }
});
export const unarchiveQuoteOK = (responseData) => ({
    type:  `${UNARCHIVE_QUOTE}_OK`,
    payload: responseData
});
export const unarchiveQuoteError = (error) => ({
    type: `${UNARCHIVE_QUOTE}_ERROR`,
    payload: error
});
export const saveQuote = (quote) => ({
    type: `${UPDATE_QUOTE}_REQUESTED`,
    payload: { quote }
});
export const saveQuoteOK = (responseData) => ({
    type:  `${UPDATE_QUOTE}_OK`,
    payload: responseData
});
export const saveQuoteError = (error) => ({
    type: `${UPDATE_QUOTE}_ERROR`,
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
