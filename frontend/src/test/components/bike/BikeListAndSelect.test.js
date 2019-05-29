import React from "react";
import BikeListAndSelect from "../../../components/bike/BikeListAndSelect";
import {assertComponentHasExpectedProps, findDataTest} from "../../jest_helpers/assert";
import {sampleBikes, sampleBrands, sampleFrames} from "../../../helpers/sampleData";
describe('BikeListAndSelect', () => {
    it('should display search and message when no bikes exist', () => {
        const component = shallow(<BikeListAndSelect
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
        />);
        expect(findDataTest(component, 'list-and-search-heading')).toHaveLength(1);
        expect(findDataTest(component, 'bikes-search')).toHaveLength(1);
        expect(findDataTest(component, 'bikes-select')).toHaveLength(0);
        expect(findDataTest(component, 'start-message')).toHaveLength(1);
    });
    it('should display search and select when bikes exist', () => {
        const component = shallow(<BikeListAndSelect
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
            bikes={sampleBikes}
            frames={sampleFrames}
            brands={sampleBrands}
        />);
        expect(findDataTest(component, 'list-and-search-heading')).toHaveLength(1);
        expect(findDataTest(component, 'bikes-search')).toHaveLength(1);
        expect(findDataTest(component, 'bikes-select')).toHaveLength(1);
        expect(findDataTest(component, 'start-message')).toHaveLength(0);
    });
    it('should pass any existing search criteria through to the bike search when they exist', () => {
        const component = shallow(<BikeListAndSelect
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
            bikes={sampleBikes}
            frames={sampleFrames}
            brands={sampleBrands}
            frameName='Caad'
            brandSelected='2'
            archived={true}
            canSelectArchived={true}
        />);
        assertComponentHasExpectedProps(findDataTest(component, "bikes-search"), {
            brands: sampleBrands,
            frameName: 'Caad',
            brandSelected: '2',
            archived: true,
            canSelectArchived: true,
        });
    })
});
