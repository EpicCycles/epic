import {NEW_ELEMENT_ID} from "../../../../helpers/constants";
import {buildPartString} from "../part";

const brands = [
    {id:1, brand_name:"brand 1"},
    {id:2, brand_name:"brand 2", supplier:[], supplier_names:[]},
    {id:3, brand_name:"brand 3", supplier:[1], supplier_names:["supplier 1"]},
    {id:4, brand_name:"brand 4", delete:true},
    {id:5, brand_name:"brand 5", changed:true, supplier:[1,3], supplier_names:["supplier 1", "supplier 3"]},
    {dummyKey:"123ABC", brand_name:"brand new", changed:true},
    {dummyKey: NEW_ELEMENT_ID, brand_name:"brand new 2", changed:true},
];

test('should build a string containing unknown brand when brand is not found', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 6
    };
    const expectedPartName = "Unknown Brand A-Head Tapered Cartridge aluminium";
    expect(buildPartString(part, brands)).toEqual(expectedPartName)
});
test('should build a string containing brand when brand is found', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 3
    };
    const expectedPartName = "brand 3 A-Head Tapered Cartridge aluminium";
    expect(buildPartString(part, brands)).toEqual(expectedPartName)
});
test('should build a string containing brand_name on the part is provided', () => {
    const part = {
        id: 65,
        part_name: 'A-Head Tapered Cartridge aluminium',
        brand_name: "Provided",
        trade_in_price: null,
        standard: false,
        stocked: false,
        partType: 3,
        brand: 3
    };
    const expectedPartName = "Provided A-Head Tapered Cartridge aluminium";
    expect(buildPartString(part, brands)).toEqual(expectedPartName)
});
