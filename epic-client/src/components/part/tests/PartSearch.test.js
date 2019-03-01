import React from 'react';
import {sampleSections} from "../../../helpers/sampleData";
import PartSearch from "../PartSearch";
import {findDataTest} from "../../../../test/assert";

const brands = [
    { id: 1, brand_name: "brand 1" },
    { id: 2, brand_name: "brand 2", supplier: [], supplier_names: [] },
    { id: 3, brand_name: "brand 3", supplier: [1], supplier_names: ["supplier 1"] },
    { id: 5, brand_name: "brand 5", changed: true, supplier: [1, 3], supplier_names: ["supplier 1", "supplier 3"] },
];
describe('PartSearch', () => {
    test('should render when minimal details are passed', () => {
        const onChange = jest.fn();
        const findParts = jest.fn();
        const props = {
            brands,
            sections: sampleSections,
            onChange,
            findParts,
        };
        const component = shallow(<PartSearch {...props}/>);
        expect(component).toMatchSnapshot();
        // expect(findDataTest(component, 'findDataTest')).toHaveLength(1);
    });
    test('should render when more details are passed', () => {
        const onChange = jest.fn();
        const findParts = jest.fn();
        const component = shallow(<PartSearch
            brands={brands}
            sections={sampleSections}
            onChange={onChange}
            findParts={findParts}
            partTypeSelected={1}
            brandSelected={5}
            searchPartName={'Hub'}
            searchStandard={true}
            searchStocked={true}
        />);
        expect(component).toMatchSnapshot();
    });
});
