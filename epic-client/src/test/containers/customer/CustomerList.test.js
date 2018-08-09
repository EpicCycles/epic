import React from 'react';
import configureStore from 'redux-mock-store'
import CustomerList from "../../../containers/customer/CustomerList";


describe("CustomerList.index tests", () => {
    // our mock login function to replace the one provided by mapDispatchToProps
    const mockGetCustomerListAsyncfn = jest.fn();
    const mockGetCustomerListPagefn = jest.fn();
    const initialState = {customer:{count: 0,
        isLoading: false,
        customers: [],
        page: 1,
        perPage: 5}};


    it('renders the CustomerList correctly', () => {
        let initialList = shallow(<CustomerList
            getCustomerListAsync={mockGetCustomerListAsyncfn}
            getCustomerListPage={mockGetCustomerListPagefn}
            count={0}
            customers={[]}
            isLoading={false}
            page={0}
            totalPages={0}
        />);
        expect(initialList).toMatchSnapshot();
    });
});
