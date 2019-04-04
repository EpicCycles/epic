import {canBeReIssued} from "../quote";

test('can not be reIssued', () => {
    const quote = {
        quote: 1,
        quote_status: 1,
        partType: 1,
        quantity: 1,
        quote_price: 11.50,
        replacement_part: true,
        quote_part_attributes: [],
    };
    expect(canBeReIssued(quote)).toBeFalsy();
});
test('can be reIssued', () => {
    const quote = {
        quote: 1,
        quote_status: 2,
        partType: 1,
        quantity: 1,
        quote_price: 11.50,
        replacement_part: true,
        quote_part_attributes: [],
    };
    expect(canBeReIssued(quote)).toBeTruthy();
})