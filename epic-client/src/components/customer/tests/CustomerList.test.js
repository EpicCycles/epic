import React from 'react';
import CustomerList from "../CustomerList";


describe("CustomerList.index tests", () => {
    // our mock login function to replace the one provided by mapDispatchToProps
    const mockGetCustomerListPagefn = jest.fn();
    const mockGetCustomerListfn = jest.fn();
    const initialState = {customer:{count: 0,
        isLoading: false,
        customers: [],
        page: 1,
        perPage: 5}};


    it('renders the CustomerList correctly', () => {
        let initialList = shallow(<CustomerList
            getCustomerListPage={mockGetCustomerListPagefn}
            getCustomerList={mockGetCustomerListfn}
            count={0}
            customers={[]}
            isLoading={false}
            page={0}
            totalPages={0}
        />);
        expect(initialList).toMatchSnapshot();
    });
});
