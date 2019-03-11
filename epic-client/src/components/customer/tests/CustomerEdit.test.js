import React from 'react';
import CustomerEdit from "../CustomerEdit";

const props = {
    deleteCustomerAddress: jest.fn(),
    saveCustomerAddress: jest.fn(),
};
describe('CustomerEdit', () => {
    it("displays a full customer with extras properly", () => {
        const fullCustomer = {
            id: 23,
            first_name: "anna",
            last_name: "Blogs",
            email: "anna@blogs.co.uk",
        };
        const note = {
            id: 278,
            note_text: "a note text",
            customer_visible: true,
            customer: fullCustomer.id
        };
        const component = shallow(
            <CustomerEdit
                customers={[fullCustomer]}
                customerId={23}
                addresses={["1", "2"]}
                phones={["10", "20"]}
                note={note}
                {...props}/>
        );
        expect(component).toMatchSnapshot();
    });
    it("displays a new customer (no id) properly", () => {

        const note = {};
        const component = shallow(
            <CustomerEdit note={note} {...props}/>
        );
        expect(component).toMatchSnapshot();
    });
});


