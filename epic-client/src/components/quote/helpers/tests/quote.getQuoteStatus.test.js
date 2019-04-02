import {getQuoteStatus} from "../quote";

test('found value returned', () => {
    expect(getQuoteStatus('2')).toEqual('Issued');
})
test('undefined returned when invalid value', () => {
    expect(getQuoteStatus('9')).toBe('9');
})