export const CREATE_QUOTE = 'quote/QUOTE_CREATE';

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