import React from 'react';
import {sampleSections} from "../../../helpers/sampleData";
import PartSearch from "../PartSearch";

const brands = [
    { id: 1, brand_name: "brand 1" },
    { id: 2, brand_name: "brand 2", supplier: [], supplier_names: [] },
    { id: 3, brand_name: "brand 3", supplier: [1], supplier_names: ["supplier 1"] },
    { id: 4, brand_name: "brand 4", delete: true },
    { id: 5, brand_name: "brand 5", changed: true, supplier: [1, 3], supplier_names: ["supplier 1", "supplier 3"] },
];
//  brands: PropTypes.array.isRequired,
//     sections: PropTypes.array.isRequired,
//     onChange: PropTypes.func.isRequired,
//     findParts: PropTypes.func.isRequired,
//     partTypeSelected: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
//     brandSelected: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
//     searchPartName: PropTypes.string,
//     searchStandard: PropTypes.bool,
//     searchStocked: PropTypes.bool,
test('should render when minimal details are passed', () => {
    const onChange = jest.fn();
    const findParts = jest.fn();
    const component = shallow(<PartSearch
        brands={brands}
        sections={sampleSections}
        onChange={onChange}
        findParts={findParts}
    />);
    expect(component).toMatchSnapshot();
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
