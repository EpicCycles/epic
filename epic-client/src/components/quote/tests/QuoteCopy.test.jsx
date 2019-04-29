import React from 'react'
import QuoteCopy from "../QuoteCopy";
import {sampleBikes} from "../../../helpers/sampleData";
import {findDataTest} from "../../../../test/assert";


describe('QuoteCopy', () => {

    const customers = [
        { id: 1, first_name: 'Fred', last_name: 'Smith' }
    ];
    it('should render with find customer and find bike components', () => {
        const component = shallow(<QuoteCopy
            getCustomerList={jest.fn()}
            copyQuote={jest.fn()}
            getFrameList={jest.fn()}
            quoteId={2}
            quotes={[{ id: 2, customer: 23, bike: 53 }]}
            bikes={sampleBikes}
        />);
        expect(findDataTest(component, "page-header")).toHaveLength(1);
        expect(findDataTest(component, "select-customer")).toHaveLength(1);
        expect(findDataTest(component, "select-bike")).toHaveLength(1);
        expect(findDataTest(component, "copy-button")).toHaveLength(1);
    });
    it('should render with find customer only when source quote has no bike', () => {
        const component = shallow(<QuoteCopy
            getCustomerList={jest.fn()}
            copyQuote={jest.fn()}
            getFrameList={jest.fn()}
            quoteId={2}
            quotes={[{ id: 2, customer: 23 }]}
            bikes={sampleBikes}
        />);
        expect(findDataTest(component, "page-header")).toHaveLength(1);
        expect(findDataTest(component, "select-customer")).toHaveLength(1);
        expect(findDataTest(component, "select-bike")).toHaveLength(0);
        expect(findDataTest(component, "copy-button")).toHaveLength(1);
    });

    it('should create a new quote with customer when create quote is clicked', () => {
        const copyQuote = jest.fn();
        const component = shallow(<QuoteCopy
            getCustomerList={jest.fn()}
            copyQuote={copyQuote}
            getFrameList={jest.fn()}
            bikes={sampleBikes}
            quoteId={2}
            quotes={[{ id: 2, customer: 23 }]}
        />);
        const expectedNewQuote = {
            customer: 1,
            bike: undefined,
        };
        component.instance().handleInputChange('customer', 1);
        findDataTest(component, "copy-button").simulate('click');
        expect(copyQuote).toHaveBeenCalledTimes(1);

        expect(copyQuote.mock.calls[0][0]).toEqual(2);
        expect(copyQuote.mock.calls[0][1]).toEqual(expect.objectContaining(expectedNewQuote));
    });
    it('should create a new quote with customer and bike when create quote is clicked', () => {
        const copyQuote = jest.fn();
        const component = shallow(<QuoteCopy
            getCustomerList={jest.fn()}
            copyQuote={copyQuote}
            getFrameList={jest.fn()}
            bikes={sampleBikes}
            quoteId={2}
            quotes={[{ id: 2, customer: 23 }]}
        />);
        component.instance().handleInputChange('bike', 58);
        const expectedNewQuote = {
            customer: 23,
            bike: 58,
        };
        findDataTest(component, "copy-button").simulate('click');
        expect(copyQuote.mock.calls[0][0]).toEqual(2);
        expect(copyQuote.mock.calls[0][1]).toEqual(expect.objectContaining(expectedNewQuote));
    });
});