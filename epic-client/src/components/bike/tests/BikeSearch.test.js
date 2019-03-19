import React from "react";
import BikeSearch from "../BikeSearch";
import {sampleBrands} from "../../../helpers/sampleData";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../test/assert";

describe('BikeSearch', () => {
    it('should display frame name, brand select  when archived is not allowed', () => {
        const component = shallow(<BikeSearch
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
            brands={sampleBrands}
        />);
        expect(component.find('BrandSelect')).toHaveLength(1);
        expect(findDataTest(component, 'frame-name')).toHaveLength(1);
        assertComponentHasExpectedProps(component.find('BrandSelect'), {
            value: '',
            fieldName: 'brand'
        });
        assertComponentHasExpectedProps(findDataTest(component, "frame-name"), {
            value: '',
            fieldName: 'frameName'
        });
        expect(findDataTest(component, 'archived-checkbox')).toHaveLength(0);
    });
    it('should display frame name, brand select and archived selection when archived is allowed', () => {
        const component = shallow(<BikeSearch
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
            brands={sampleBrands}
            canSelectArchived={true}
        />);
        expect(component.find('BrandSelect')).toHaveLength(1);
        expect(component.find('FormTextInput')).toHaveLength(1);
        expect(findDataTest(component, 'archived-checkbox')).toHaveLength(1);
    });
    it('should display existing search criteria when passed', () => {
        const component = shallow(<BikeSearch
            onChange={jest.fn()}
            onClick={jest.fn()}
            getFrameList={jest.fn()}
            brands={sampleBrands}
            canSelectArchived={true}
            brandSelected={'3'}
            frameName={'Caadx'}
            archved={true}
        />);
        expect(component.find('BrandSelect')).toHaveLength(1);
        expect(component.find('FormTextInput')).toHaveLength(1);
        expect(findDataTest(component, 'archived-checkbox')).toHaveLength(1);
        assertComponentHasExpectedProps(component.find('BrandSelect'), {
            value: '3',
            fieldName: 'brand'
        });
        assertComponentHasExpectedProps(findDataTest(component, "frame-name"), {
            value: 'Caadx',
            fieldName: 'frameName'
        });
    });

    describe('calling passed functions', () => {
        let component;
        let onChange;
        let onClick;
        let getFrameList;
        beforeEach(() => {
            onChange = jest.fn();
            onClick = jest.fn();
            getFrameList = jest.fn();
            component = shallow(<BikeSearch
                onChange={onChange}
                onClick={onClick}
                getFrameList={getFrameList}
                brands={sampleBrands}
                canSelectArchived={true}
                brandSelected={'3'}
                frameName={'Caadx'}
                archved={true}
            />);
        });
        it('should call onchange when brand is changed', () => {
            component.find('BrandSelect').simulate("change");
            expect(onChange.mock.calls.length).toBe(1);
        });
        it('should call onchange when frameName is changed', () => {
           findDataTest(component, "frame-name").simulate("change");
            expect(onChange.mock.calls.length).toBe(1);
        });
        it('should call onchange when archived is changed', () => {
           findDataTest(component, "archived-checkbox").simulate("change");
            expect(onChange.mock.calls.length).toBe(1);
            expect(onChange).toBeCalledWith('archived', true);
        });
    })
});
