import React, {Fragment} from "react";
import PartTypeSelect from "../../../components/partType/PartTypeSelect";

test("it displays correctly", () => {
    const sections = [
        {
            id: 1,
            shortName: "sections1",
            partTypes: [
                {
                    id: 11, shortName: "partType 1",
                }
            ]
        },
        {
            id: 2,
            shortName: "sections2",
            partTypes: [
                {
                    id: 21, shortName: "partType 21",
                },
                {
                    id: 22, shortName: "partType 22",
                },
                {
                    id: 23, shortName: "partType 23",
                },
            ]
        },
    ];
    const component = shallow(<PartTypeSelect
        sections={sections}
        fieldName="name_of_field"
    />);
    expect(component).toMatchSnapshot();
});