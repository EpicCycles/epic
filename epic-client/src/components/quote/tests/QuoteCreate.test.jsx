import React from 'react'
import QuoteCreate from "../QuoteCreate";
import {sampleBikes} from "../../../helpers/sampleData";
import {findDataTest} from "../../../../test/assert";


describe('QuoteCreate', () => {

    const customers = [
        {id: 1, first_name:'Fred', last_name:'Smith'}
    ];
    it('should render with find customer and find bike components', () => {
        const component = shallow(<QuoteCreate
            getCustomerList={jest.fn()}
            createQuote={jest.fn()}
            getFrameList={jest.fn()}
        />);
        expect(findDataTest(component, "page-header")).toHaveLength(1);
        expect(findDataTest(component, "select-customer")).toHaveLength(1);
        expect(findDataTest(component, "select-bike")).toHaveLength(1);
        expect(findDataTest(component, "create-button")).toHaveLength(1);
    });

    it('should create a new quote with customer when create quote is clicked', () => {
        const createQuote = jest.fn();
        const component = shallow(<QuoteCreate
            getCustomerList={jest.fn()}
            createQuote={createQuote}
            getFrameList={jest.fn()}
            bikes={sampleBikes}
            customerId={1}
        />);
        const expectedNewQuote = {
            customer: 1,
            bike: undefined,
        };
        findDataTest(component, "create-button").simulate('click');
        expect(createQuote).toHaveBeenCalledTimes(1);
        expect(createQuote).toHaveBeenCalledWith(expect.objectContaining(expectedNewQuote));
    });
    it('should create a new quote with customer and bike when create quote is clicked', () => {
       const createQuote = jest.fn();
        const component = shallow(<QuoteCreate
            getCustomerList={jest.fn()}
            createQuote={createQuote}
            getFrameList={jest.fn()}
            bikes={sampleBikes}
            customerId={1}
            bikeId={58}
        />);
        const expectedNewQuote = {
            customer: 1,
            bike: 58,
            quote_price: null,
        };
        findDataTest(component, "create-button").simulate('click');
        expect(createQuote).toHaveBeenCalledTimes(1);
        expect(createQuote).toHaveBeenCalledWith(expect.objectContaining(expectedNewQuote));
    });
});