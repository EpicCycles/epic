import React from "react";
import QuoteFind from "../QuoteFind";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../test/assert";
import {sampleBikes, sampleBrands} from "../../../helpers/sampleData";

describe('QuoteFind', () => {
    it('should render when minimum data present', () => {
        const component = shallow(<QuoteFind
            getFrameList={jest.fn()}
            getCustomerList={jest.fn()}
            clearCustomerState={jest.fn()}
            getQuoteList={jest.fn()}
        />);
        assertComponentHasExpectedProps(component.find('customer-select'), {
            customers: [],
        });
        assertComponentHasExpectedProps(component.find('bike-select'), {
            brands: [],
            bikes: [],
            frames: [],
        });
        assertComponentHasExpectedProps(component.find('archived-checkbox'), {
            fieldName: 'archived',
            fieldValue: false,
        });
        assertComponentHasExpectedProps(component.find('search'), {
            disabled: true,
        });
    });
    it('should call the get list function when search is clicked with the right data', () => {
        const getQuoteList = jest.fn();
        const component = shallow(<QuoteFind
            getFrameList={jest.fn()}
            getCustomerList={jest.fn()}
            clearCustomerState={jest.fn()}
            getQuoteList={getQuoteList}
            brands={sampleBrands}
            bikes={sampleBikes}
        />);
        assertComponentHasExpectedProps(component.find('search'), {
            disabled: true,
        });
        component.instance().handleInputChange('archived', true);
        assertComponentHasExpectedProps(component.find('search'), {
            disabled: true,
        });
        component.instance().handleInputChange('bike', 58);
        assertComponentHasExpectedProps(component.find('search'), {
            disabled: false,
        });
        findDataTest(component, "search").simulate('click');
        const expectedCallData = {
            brand: '',
            frameName: '',
            selectedCustomer: '',
            bike: 58,
            archived: true,
            quoteDesc: '',
        };
        expect(getQuoteList).toHaveBeenCalledWith(expectedCallData);
    });
});