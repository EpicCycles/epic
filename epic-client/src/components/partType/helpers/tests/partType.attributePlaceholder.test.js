import {attributePlaceholder} from "../partType";
const attributeNoOptions = {
        "attribute_name": "Colour",
        "in_use": true,
        "mandatory": true,
    };
const attributeWithOptions = {
        "attribute_name": "Braze/Band",
        "in_use": true,
        "mandatory": false,
        options: [
            {
                "id": 2,
                "option_name": "Band",
                "part_type_attribute": 4
            },
            {
                "id": 1,
                "option_name": "Braze",
                "part_type_attribute": 4
            }
        ],
    };
const unUsedAttribute = {
        "attribute_name": "Braze/Band",
        "in_use": false,
        "mandatory": true,
        options: []
    };
describe('attributePlaceholder', () => {
    it('should return an empty string when the part type has no attributes', () => {
        const partType = {id: 2};
        expect(attributePlaceholder(partType)).toEqual('');
    });
    it('should return an empty string when the part type has an empty set of attributes', () => {
        const partType = {id: 2, attributes: []};
        expect(attributePlaceholder(partType)).toEqual('');
    });
    it('should return an empty string when the part type has unused attributes only', () => {
        const partType = {id: 2, attributes: [unUsedAttribute]};
        expect(attributePlaceholder(partType)).toEqual('');
    });
    it('should return a single attribute with no options', () => {
        const partType = {id: 2, attributes: [attributeNoOptions]};
        expect(attributePlaceholder(partType)).toEqual('Colour');
    })
    it('should return a single attribute with options', () => {
        const partType = {id: 2, attributes: [attributeWithOptions]};
        expect(attributePlaceholder(partType)).toEqual('Braze/Band(Band,Braze)');
    })
   it('should return multiple values', () => {
        const partType = {id: 2, attributes: [attributeNoOptions, unUsedAttribute, attributeWithOptions]};
        expect(attributePlaceholder(partType)).toEqual('Colour, Braze/Band(Band,Braze)');
    })
});