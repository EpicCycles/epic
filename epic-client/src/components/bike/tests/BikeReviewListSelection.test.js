import React from "react";
import BikeReviewListSelection from "../BikeReviewListSelection";
import {sampleBrands} from "../../../helpers/sampleData";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../test/assert";

describe('BikeReviewListSelection', () => {
    it('should show header and search block when loaded', () => {
        const component = shallow(<BikeReviewListSelection
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
            brands={sampleBrands}
            brandSelected={'3'}
            frameName={'Caadx'}
            archived={true}
        />);
        expect(findDataTest(component, 'bike-review-heading')).toHaveLength(1);
        expect(findDataTest(component, 'bike-search')).toHaveLength(1);
        assertComponentHasExpectedProps(findDataTest(component, "bike-search"), {
            brands: sampleBrands,
            brandSelected: '3',
            frameName: 'Caadx',
            archived: true,
            canSelectArchived: true,
        });
    });
});
