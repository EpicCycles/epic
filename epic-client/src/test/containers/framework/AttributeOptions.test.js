import React from 'react';
import AttributeOptions from "../../../containers/framework/AttributeOptions";

describe("AttributeOptions tests", () => {

    const attributeId = 234;

    it("renders the form correctly with no options", () => {
        const input = shallow(
            <AttributeOptions options={[]} attributeKey={attributeId}/>
        );
        expect(input).toMatchSnapshot();
    });
    it("renders the form correctly with options", () => {
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = shallow(
            <AttributeOptions options={options} attributeKey={attributeId}/>
        );
        expect(input).toMatchSnapshot();
    });
    it("renders the form correctly when all options deleted", () => {
        const optionsDeleted = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze', delete: true },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: true },
            { part_type_attribute: 1, attribute_option: 'braze', dummyKey: 'hjgfkuyg34', delete: true },
        ];
        const input = shallow(
            <AttributeOptions options={optionsDeleted} attributeKey={attributeId}/>
        );
        expect(input).toMatchSnapshot();
    });

});