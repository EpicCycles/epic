import {partReadyToUse} from "../../../../components/part/helpers/part";

test('should return false when this is exactly the part we started with', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    const persistedPart = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    expect(partReadyToUse(part,persistedPart)).toBeFalsy();
});
test('should return true when there have been changes to a field', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: 35,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    const persistedPart = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    expect(partReadyToUse(part,persistedPart)).toBeTruthy();
});
test('should return true when we started with no part', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    const persistedPart = {};
    expect(partReadyToUse(part,persistedPart)).toBeTruthy();
});
test('should return true when we started with a different part', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    const persistedPart = {id: 66,};
    expect(partReadyToUse(part,persistedPart)).toBeTruthy();
});
test('should return true when we started with nothing', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6
    };
    expect(partReadyToUse(part)).toBeTruthy();
});
test('should return false when we started with nothing but the part has errors', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 23,
        brand: 6,
        error_detail: {part_name: 'error'}
    };
    expect(partReadyToUse(part)).toBeFalsy();
});