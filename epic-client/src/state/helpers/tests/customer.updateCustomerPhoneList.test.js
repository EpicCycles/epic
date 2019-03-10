import {updateCustomerPhoneList} from "../customer";

describe('customer.updateCustomerPhoneList', () => {
    const customerPhone = {
        number_type: "H",
        telephone: "78736",
        id: 12,
        error: true
    };
    const customerAddress = {
        id: 123,
        address1: "line one",
        address2: "line Ywo",
        address3: "line Three",
        address4: "line Four",
        postcode: "xxxyyy",
        customer: 6
    };
    const customers = [
        {
            id: 16,
            first_name: 'Anna',
            last_name: 'Weaver',
            email: 'anna.weaver@johnlewis.co.uk',
            add_date: '2018-07-04T13:02:09.988286+01:00',
            upd_date: '2018-07-04T13:02:09.988343+01:00',
            phones: [customerPhone],
            addresses: [customerAddress]
        },
        {
            id: 26,
            first_name: 'dfds',
            last_name: 'Weasdfdsfver',
            add_date: '2018-07-04T13:02:09.988286+01:00',
            upd_date: '2018-07-04T13:02:09.988343+01:00'
        },
    ];

    it('should return an unchanged list when the customer id is not found', () => {
        expect(updateCustomerPhoneList(customers, 12345, [])).toEqual(customers);
    })
    it('should replace a pre-existing array when phnoes are passed ', () => {
        const newPhoneList = [];
        const updatedCustomers = updateCustomerPhoneList(customers, 16, newPhoneList);
        expect(updatedCustomers[0].phones).toEqual([]);
        expect(updatedCustomers[1].phones).toEqual(undefined);
    });
    it('should add a phone array when customer does not have one ', () => {
        const newPhoneList = [];
        const updatedCustomers = updateCustomerPhoneList(customers, 26, newPhoneList);
        expect(updatedCustomers[0].phones).toEqual([customerPhone]);
        expect(updatedCustomers[1].phones).toEqual([]);
    });
    it('should replace a pre-existing array when phones are passed ', () => {
        const newPhoneList = [
            {
                number_type: "M",
                telephone: "7873878768686",
                id: 122,
            },
            customerPhone,
            {
                number_type: "W",
                telephone: "534646436346",
                id: 132,
            }
        ];
        const updatedCustomers = updateCustomerPhoneList(customers, 16, newPhoneList);
        expect(updatedCustomers[0].phones).toEqual(newPhoneList);
        expect(updatedCustomers[1].phones).toEqual(undefined);
    });
});