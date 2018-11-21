import React from 'react';
import PartTypeAttributeEdit from "../../../components/partTypeAttribute/PartTypeAttributeEdit";

describe("PartTypeAttributeEdit tests", () => {
    const attribute = { id: 123, part_type_attribute: 101, attribute_option: 'braze' };

    const attributeId = 234;

    it("renders the component correctly with a new attribute", () => {
        const input = shallow(
            <PartTypeAttributeEdit attribute={{}} componentKey="new"/>
        );
        expect(input).toMatchSnapshot();
    });
    it("renders the component correctly with an attribute", () => {
        const input = shallow(
            <PartTypeAttributeEdit attribute={attribute} componentKey="new"/>
        );
        expect(input).toMatchSnapshot();
    });
    it("handles change of the attribute name by calling the passed function", () => {
        const acceptChanges = jest.fn();
         const input = shallow(
            <PartTypeAttributeEdit attribute={attribute} componentKey="new" updatePartTypeAttribute={acceptChanges}/>
        );
    })
});