import React from "react";
import CustomerSearch from "../CustomerSearch";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../test/assert";

describe('CustomerSearch', () => {
    const getCustomerList = jest.fn();
    const searchParams = {
        firstName: 'Bob',
        lastName: 'Field',
        email: 'Bob.field',
    };
    let component;
    test('should display with empty search fields when initially loaded', () => {
        component = shallow(<CustomerSearch getCustomerList={getCustomerList}/>);
        expect(component.state('firstName')).toEqual('');
        expect(component.state('lastName')).toEqual('');
        expect(component.state('email')).toEqual('');
        expect(findDataTest(component, "first-name-input")).toHaveLength(1);
        expect(findDataTest(component, "last-name-input")).toHaveLength(1);
        expect(findDataTest(component, "email-input")).toHaveLength(1);
        assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
            value: '',
            fieldName: 'firstName'
        });
        assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
            value: '',
            fieldName: 'lastName'
        });
        assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
            value: '',
            fieldName: 'email'
        });
    })
    test('should display with used search fields when loaded', () => {

        const component = shallow(<CustomerSearch
            getCustomerList={getCustomerList}
            searchParams={searchParams}
        />);
        expect(component.state('firstName')).toEqual('Bob');
        expect(component.state('lastName')).toEqual('Field');
        expect(component.state('email')).toEqual('Bob.field');
        expect(findDataTest(component, "first-name-input")).toHaveLength(1);
        expect(findDataTest(component, "last-name-input")).toHaveLength(1);
        expect(findDataTest(component, "email-input")).toHaveLength(1);
        assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
            value: 'Bob',
            fieldName: 'firstName'
        });
        assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
            value: 'Field',
            fieldName: 'lastName'
        });
        assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
            value: 'Bob.field',
            fieldName: 'email'
        });
    });
    test('should disable search when data is loading', () => {
        const searchParams = {
            firstName: 'Bob',
            lastName: 'Field',
            email: 'Bob.field',
        };
        const component = shallow(<CustomerSearch
            getCustomerList={getCustomerList}
            searchParams={searchParams}
            isLoading={true}
        />);
        const findButton = findDataTest(component, "find-button");
        expect(findButton).toHaveLength(1);
        assertComponentHasExpectedProps(findButton, {
            type: 'submit',
            disabled: true,
        });
    });
    describe('Field Changes', () => {
        beforeEach(() => {
            component = shallow(<CustomerSearch
                getCustomerList={getCustomerList}
                searchParams={searchParams}
            />);
        });
        test('should update state when changes to first name keyed', () => {
            component.instance().handleInputChange('firstName', 'Able');
            assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                value: 'Able',
                fieldName: 'firstName'
            });
            assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                value: 'Field',
                fieldName: 'lastName'
            });
            assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                value: 'Bob.field',
                fieldName: 'email'
            });
        });
        test('should update state when changes to last name keyed', () => {
            component.instance().handleInputChange('lastName', 'Able');
            assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                value: 'Bob',
                fieldName: 'firstName'
            });
            assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                value: 'Able',
                fieldName: 'lastName'
            });
            assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                value: 'Bob.field',
                fieldName: 'email'
            });
        });
        test('should update state when changes to email keyed', () => {
            component.instance().handleInputChange('email', 'gmail.com');
            assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                value: 'Bob',
                fieldName: 'firstName'
            });
            assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                value: 'Field',
                fieldName: 'lastName'
            });
            assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                value: 'gmail.com',
                fieldName: 'email'
            });
        });
    });
    describe('Field resets', () => {
        describe('with no initial data', () => {
            beforeEach(() => {
                component = shallow(<CustomerSearch getCustomerList={getCustomerList}/>);
            });
            test('should update state when changes to first name keyed', () => {
                component.instance().handleInputChange('firstName', 'Able');
                assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                    value: 'Able',
                    fieldName: 'firstName'
                });
                assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                    value: '',
                    fieldName: 'lastName'
                });
                assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                    value: '',
                    fieldName: 'email'
                });

                component.instance().handleInputClear('firstName');
                assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                    value: '',
                    fieldName: 'firstName'
                });
            });
            test('should update state when changes to last name keyed', () => {
                component.instance().handleInputChange('lastName', 'Able');
                assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                    value: '',
                    fieldName: 'firstName'
                });
                assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                    value: 'Able',
                    fieldName: 'lastName'
                });
                assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                    value: '',
                    fieldName: 'email'
                });

                component.instance().handleInputClear('lastName');
                assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                    value: '',
                    fieldName: 'lastName'
                });
            });
            test('should update state when changes to email keyed', () => {
                component.instance().handleInputChange('email', 'gmail.com');
                assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                    value: '',
                    fieldName: 'firstName'
                });
                assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                    value: '',
                    fieldName: 'lastName'
                });
                assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                    value: 'gmail.com',
                    fieldName: 'email'
                });
                component.instance().handleInputClear('email');
                assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                    value: '',
                    fieldName: 'email'
                });
            });
        });
        describe('with initial data', () => {
            beforeEach(() => {
                component = shallow(<CustomerSearch
                    getCustomerList={getCustomerList}
                    searchParams={searchParams}
                />);
            });
            test('should update state when changes to first name keyed', () => {
                component.instance().handleInputChange('firstName', 'Able');
                assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                    value: 'Able',
                    fieldName: 'firstName'
                });
                component.instance().handleInputClear('firstName');
                assertComponentHasExpectedProps(findDataTest(component, "first-name-input"), {
                    value: 'Bob',
                    fieldName: 'firstName'
                });
            });
            test('should update state when changes to last name keyed', () => {
                component.instance().handleInputChange('lastName', 'Able');
                assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                    value: 'Able',
                    fieldName: 'lastName'
                });
                component.instance().handleInputClear('lastName');
                assertComponentHasExpectedProps(findDataTest(component, "last-name-input"), {
                    value: 'Field',
                    fieldName: 'lastName'
                });
            });
            test('should update state when changes to email keyed', () => {
                component.instance().handleInputChange('email', 'gmail.com');
                assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                    value: 'gmail.com',
                    fieldName: 'email'
                });
                component.instance().handleInputClear('email');
                assertComponentHasExpectedProps(findDataTest(component, "email-input"), {
                    value: 'Bob.field',
                    fieldName: 'email'
                });
            });
        });
    });
    test('should call passed function with search criteria when find is clicked', () => {
        const component = shallow(<CustomerSearch
            getCustomerList={getCustomerList}
            searchParams={searchParams}
        />);
        component.instance().handleInputChange('firstName', 'Able');
        component.instance().handleInputChange('lastName', 'Seaman');
        component.instance().handleInputChange('email', 'Pig');

        findDataTest(component, "search-form").simulate('submit');
        expect(getCustomerList).toBeCalledTimes(1);
        expect(getCustomerList).toBeCalledWith('Able', 'Seaman', 'Pig');

    });
});