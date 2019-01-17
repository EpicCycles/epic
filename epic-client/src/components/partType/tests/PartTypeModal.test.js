import React from 'react';
import PartTypeModal from "../PartTypeModal";
import {PART_TYPE_NAME_MISSING, SECTION_MISSING} from "../../app/model/helpers/error";

const sections = [
    { name: "section 1", id: 1 },
    { name: "section 2", id: 2 }
];
test("displays correctly with a new part", () => {
    const component = shallow(<PartTypeModal
        partTypeModalOpen={true}
        sections={sections}
    />);
    expect(component).toMatchSnapshot();
});
test("displays correctly with a partial new part", () => {
    const partType = {
        shortName: "new one",
        _detail: true
    };
    const component = shallow(<PartTypeModal
        partTypeModalOpen={true}
        sections={sections}
        partType={partType}
    />);
    expect(component).toMatchSnapshot();
});
test("error when no short name", () => {
    const partType = {
        includeInSection:sections[0].id,
        shortName: "has one one",
        id: "1",
        _detail: true
    };
    const component = shallow(<PartTypeModal
        partTypeModalOpen={true}
        sections={sections}
        partType={partType}
    />);
    expect(component).toMatchSnapshot();

    component.instance().handlePartTypeValueChange("shortName_1", "");
    const expectedData = Object.assign({}, partType, {
        shortName: "",
        changed: true,
        error: true,
        error_detail: PART_TYPE_NAME_MISSING
    });
    expect(component.state('partType')).toEqual(expectedData);

});
test("error when no includeInSection", () => {
    const partType = {
        includeInSection:sections[0].id,
        shortName: "has one one",
        id: "1",
        _detail: true
    };
    const component = shallow(<PartTypeModal
        partTypeModalOpen={true}
        sections={sections}
        partType={partType}
    />);
    expect(component).toMatchSnapshot();

    component.instance().handlePartTypeValueChange("includeInSection_1", "");
    const expectedData = Object.assign({}, partType, {
        includeInSection: "",
        changed: true,
        error: true,
        error_detail: SECTION_MISSING
    });
    expect(component.state('partType')).toEqual(expectedData);

});