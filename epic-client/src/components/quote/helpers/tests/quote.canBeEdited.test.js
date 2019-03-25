import {canBeEdited} from "../quote";

test('can be edited', () => {
    const quote = {
        quote: 1,
        quote_status: 1,
        partType: 1,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
    };
    expect(canBeEdited(quote)).toBeTruthy();
});
test('can not be edited', () => {
    const quote = {
        quote: 1,
        quote_status: 2,
        partType: 1,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
    };
    expect(canBeEdited(quote)).toBeFalsy();
})