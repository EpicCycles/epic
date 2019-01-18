import React from 'react';
import PartTypeData from "../PartTypeData";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
test("displays the PartTypeData component for an existing part type with attributes, detail hidden", () => {
    const componentKey = "21";
    const partType = {
        _detail: false,
        id:21,
        name:"part one",
        can_be_substituted: false,
        can_be_omitted: true,
        customer_visible:true
    };
    const component = shallow(<PartTypeData componentKey={componentKey} partType={partType} />);
    expect(component).toMatchSnapshot();
});
test("displays the PartTypeData component for an existing part type with attributes, detail shown", () => {
    const componentKey = "dummy2";
    const partType = {
        _detail: true,
        dummyKey:componentKey,
        name:"part one",
        can_be_substituted: false,
        can_be_omitted: true,
        customer_visible:true,
        attributes: ["attribute1","attribute2"],
        synonyms: ["synonym1","synonym1"]
    };
    const component = shallow(<PartTypeData componentKey={componentKey} partType={partType} />);
    expect(component).toMatchSnapshot();
});
test("displays the PartTypeData component for a new part type with no attributes", () => {
    const partType = {
        _detail: true,
        dummyKey:NEW_ELEMENT_ID,
        name:"part one",
        can_be_substituted: false,
        can_be_omitted: true,
        customer_visible:true
};
    const component = shallow(<PartTypeData componentKey={NEW_ELEMENT_ID} partType={partType} />);
    expect(component).toMatchSnapshot();
});