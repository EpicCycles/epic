import React from 'react';
import BikeReview from "../BikeReview";
import {sampleBrands, sampleSections, sampleSuppliers} from "../../../helpers/sampleData";
import {assertComponentHasExpectedProps} from "../../../../test/assert";
import {bikeFields} from "../../app/model/helpers/fields";

const bikes = [
    { id: 1, frame: 1001 },
    { id: 2, frame: 1001 },
    { id: 3, frame: 3001 },
];
const bikeParts = [
    { id: 101, bike: 1, part: 11 },
    { id: 102, bike: 1, part: 12 },
    { id: 103, bike: 1, part: 13 },
];
const parts = [
    { id: 10, },
    { id: 11, },
    { id: 12, },
    { id: 13, },
    { id: 21, },
];
const frames = [
    { id: 1001 },
    { id: 3001 },
];
describe('BikeReview', () => {
    let component;
    let reviewBike;
    let saveBike;
    let deleteBikes;
    let getBike;
    let getBikeParts;
    let saveBikePart;
    let deleteBikePart;
    let addBikePart;
    let listParts;
    const props = {
        sections: sampleSections,
        parts,
        bikes,
        bikeParts,
        frames,
        brands: sampleBrands,
        suppliers: sampleSuppliers,
        bikeReviewList: [1, 2, 3],
        bikeId: 1,
    };
    beforeEach(() => {
        saveBike = jest.fn();
        deleteBikes = jest.fn();
        reviewBike = jest.fn();
        getBike = jest.fn();
        getBikeParts = jest.fn();
        saveBikePart = jest.fn();
        deleteBikePart = jest.fn();
        addBikePart = jest.fn();
        listParts = jest.fn();
        component = shallow(<BikeReview
            {...props}
            saveBike={saveBike}
            deleteBikes={deleteBikes}
            reviewBike={reviewBike}
            getBike={getBike}
            getBikeParts={getBikeParts}
            saveBikePart={saveBikePart}
            deleteBikePart={deleteBikePart}
            addBikePart={addBikePart}
            listParts={listParts}
        />);
    });
    test('should render with basic info', () => {
        const component = shallow(<BikeReview
            bikeId={1}
            bikeReviewList={[1, 2, 3]}
            bikes={bikes}
            bikeParts={bikeParts}
            parts={parts}
            frames={frames}
            getBrandsAndSuppliers={jest.fn()}
            saveBrands={jest.fn()}
            getFramework={jest.fn()}
            reviewBike={jest.fn()}
            saveBike={jest.fn()}
            deleteBikes={jest.fn()}
            getBike={jest.fn()}
            getBikeParts={jest.fn()}
            saveBikePart={jest.fn()}
            deleteBikePart={jest.fn()}
            addBikePart={jest.fn()}
            listParts={jest.fn()}
        />);
        expect(component.find('PartFinder').length).toBe(0);
        expect(component.find('BikeEdit').length).toBe(1);
        expect(component.find('PartDisplayGrid').length).toBe(1);
        expect(component.find('Pagination').length).toBe(1);
    });
    test('should call review bike with next bike when page is selected', () => {
        component.instance().reviewSelectedBike(2);
        expect(reviewBike).toHaveBeenCalledTimes(1);
        expect(reviewBike).toHaveBeenCalledWith(2);
    });
    test('should call deleteBikePart when it is requested', () => {
        component.instance().deletePart(222);
        expect(deleteBikePart).toHaveBeenCalledTimes(1);
        expect(deleteBikePart).toHaveBeenCalledWith(1, 222);
    });
    test('should call saveBikePart when a part that exists is saved', () => {
        const existingPart = { id: 123345, part_name: '2thing' };
        component.instance().saveOrAddPart(existingPart);
        expect(saveBikePart).toHaveBeenCalledTimes(1);
        expect(saveBikePart).toHaveBeenCalledWith(1, existingPart);
    });
    test('should call addBikePart when a part that is new is saved', () => {
        const newPart = { part_name: '2thing' };
        component.instance().saveOrAddPart(newPart);
        expect(addBikePart).toHaveBeenCalledTimes(1);
        expect(addBikePart).toHaveBeenCalledWith(1, newPart);
    });
    test('should show part finder with selected part when it is requested', () => {
        const existingPart = { id: 123345, part_name: '2thing' };
        component.instance().showPartFinder(existingPart);
        expect(component.state('showPartFinder')).toBeTruthy();
        expect(component.find('PartFinder').length).toBe(1);
        assertComponentHasExpectedProps(component.find('PartFinder'), {
            part: existingPart,
        });
        expect(component.find('BikeEdit').length).toBe(1);
        expect(component.find('PartDisplayGrid').length).toBe(1);
        expect(component.find('Pagination').length).toBe(1);
    });
    test('should show part finder with different selected part when it is requested', () => {
        const existingPart = { id: 123345, part_name: '2thing' };
        component.instance().showPartFinder(existingPart);
        expect(component.state('showPartFinder')).toBeTruthy();
        expect(component.find('PartFinder').length).toBe(1);
        assertComponentHasExpectedProps(component.find('PartFinder'), {
            part: existingPart,
        });

        const newPart = { part_name: '2thing' };
        component.instance().showPartFinder(newPart);
        expect(component.state('showPartFinder')).toBeTruthy();
        expect(component.find('PartFinder').length).toBe(1);
        assertComponentHasExpectedProps(component.find('PartFinder'), {
            part: existingPart,
        });
    });
    test('should show part finder with no selected part when it is requested', () => {
        component.instance().showPartFinder();
        expect(component.state('showPartFinder')).toBeTruthy();
        expect(component.find('PartFinder').length).toBe(1);
        assertComponentHasExpectedProps(component.find('PartFinder'), {
            part: {},
        });
        expect(component.find('BikeEdit').length).toBe(1);
        expect(component.find('PartDisplayGrid').length).toBe(1);
        expect(component.find('Pagination').length).toBe(1);
    });
});
