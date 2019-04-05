import {
    BRAND_FIELD,
    PART_NAME_FIELD,
    PART_TYPE_FIELD,
    STANDARD_FIELD, STOCKED_FIELD,
    TRADE_IN_FIELD
} from "../../../app/model/helpers/fields";
import {getModelFields} from "../part";

test('should return fields without stocked and part type when part is not standard', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 6
    };
    const expectedPartFields = [
        BRAND_FIELD,
        PART_NAME_FIELD,
        TRADE_IN_FIELD,
        STANDARD_FIELD,
    ];
    expect(getModelFields(part)).toEqual(expectedPartFields);
})
test('should return fields without stocked and with part type when part is not passed', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 6
    };
    const expectedPartFields = [
        PART_TYPE_FIELD,
        BRAND_FIELD,
        PART_NAME_FIELD,
        TRADE_IN_FIELD,
        STANDARD_FIELD,
    ];
    expect(getModelFields()).toEqual(expectedPartFields);
})
test('should return fields with part type when part type is editable', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 6
    };
    const expectedPartFields = [
        PART_TYPE_FIELD,
        BRAND_FIELD,
        PART_NAME_FIELD,
        TRADE_IN_FIELD,
        STANDARD_FIELD,
    ];
    expect(getModelFields(part, true)).toEqual(expectedPartFields);
});
test('should return fields with stocked when part type is standard', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: true,
        stocked: false,
        partType: 3,
        brand: 6
    };
    const expectedPartFields = [
        PART_TYPE_FIELD,
        BRAND_FIELD,
        PART_NAME_FIELD,
        TRADE_IN_FIELD,
        STANDARD_FIELD,
        STOCKED_FIELD
    ];
    expect(getModelFields(part, true)).toEqual(expectedPartFields);
});