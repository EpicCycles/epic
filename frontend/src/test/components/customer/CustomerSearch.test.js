import React from 'react';
import CustomerSearch from '../../../components/customer/CustomerSearch';
import { assertComponentHasExpectedProps, findDataTest } from '../../../test/jest_helpers/assert';

describe('CustomerSearch', () => {
  const getCustomerList = jest.fn();
  const searchParams = {
    firstName: 'Bob',
    lastName: 'Field',
    email: 'Bob.field',
  };
  describe('display only', () => {
    test('should display with empty search fields when initially loaded', () => {
      const component = shallow(<CustomerSearch getCustomerList={getCustomerList} />);
      expect(component.state('firstName')).toEqual('');
      expect(component.state('lastName')).toEqual('');
      expect(component.state('email')).toEqual('');
      expect(component.find('SearchBlock')).toHaveLength(1);
    });
    test('should display with used search fields when loaded', () => {
      const component = shallow(
        <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} />,
      );
      expect(component.state('firstName')).toEqual('Bob');
      expect(component.state('lastName')).toEqual('Field');
      expect(component.state('email')).toEqual('Bob.field');
      expect(component.find('SearchBlock')).toHaveLength(1);
    });
    test('should disable search when data is loading', () => {
      const searchParamsOther = {
        firstName: 'Bob',
        lastName: 'Field',
        email: 'Bob.field',
      };
      const component = shallow(
        <CustomerSearch
          getCustomerList={getCustomerList}
          searchParams={searchParamsOther}
          isLoading
        />,
      );
      const findButton = component.find('SearchBlock');
      expect(findButton).toHaveLength(1);
      assertComponentHasExpectedProps(findButton, {
        searchCriteriaValid: false,
      });
    });
  });
  describe('Field Changes', () => {
    let component;
    beforeEach(() => {
      component = shallow(
        <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} />,
      );
    });
    test('should update state when changes to first name keyed', () => {
      component.instance().handleInputChange('firstName', 'Able');
      assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
        value: 'Able',
        fieldName: 'firstName',
      });
      assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
        value: 'Field',
        fieldName: 'lastName',
      });
      assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
        value: 'Bob.field',
        fieldName: 'email',
      });
    });
    test('should update state when changes to last name keyed', () => {
      component.instance().handleInputChange('lastName', 'Able');
      assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
        value: 'Bob',
        fieldName: 'firstName',
      });
      assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
        value: 'Able',
        fieldName: 'lastName',
      });
      assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
        value: 'Bob.field',
        fieldName: 'email',
      });
    });
    test('should update state when changes to email keyed', () => {
      component.instance().handleInputChange('email', 'gmail.com');
      assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
        value: 'Bob',
        fieldName: 'firstName',
      });
      assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
        value: 'Field',
        fieldName: 'lastName',
      });
      assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
        value: 'gmail.com',
        fieldName: 'email',
      });
    });
  });
  describe('Field resets', () => {
    let component;
    describe('with no initial data', () => {
      beforeEach(() => {
        component = shallow(<CustomerSearch getCustomerList={getCustomerList} />);
      });
      test('should update state when changes to first name keyed', () => {
        component.instance().handleInputChange('firstName', 'Able');
        assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
          value: 'Able',
          fieldName: 'firstName',
        });
        assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
          value: '',
          fieldName: 'lastName',
        });
        assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
          value: '',
          fieldName: 'email',
        });
      });
      test('should update state when changes to last name keyed', () => {
        component.instance().handleInputChange('lastName', 'Able');
        assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
          value: '',
          fieldName: 'firstName',
        });
        assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
          value: 'Able',
          fieldName: 'lastName',
        });
        assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
          value: '',
          fieldName: 'email',
        });
      });
      test('should update state when changes to email keyed', () => {
        component.instance().handleInputChange('email', 'gmail.com');
        assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
          value: '',
          fieldName: 'firstName',
        });
        assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
          value: '',
          fieldName: 'lastName',
        });
        assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
          value: 'gmail.com',
          fieldName: 'email',
        });
      });
    });
    describe('with initial data', () => {
      beforeEach(() => {
        component = shallow(
          <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} />,
        );
      });
      test('should update state when changes to first name keyed', () => {
        component.instance().handleInputChange('firstName', 'Able');
        assertComponentHasExpectedProps(findDataTest(component, 'first-name-input'), {
          value: 'Able',
          fieldName: 'firstName',
        });
      });
      test('should update state when changes to last name keyed', () => {
        component.instance().handleInputChange('lastName', 'Able');
        assertComponentHasExpectedProps(findDataTest(component, 'last-name-input'), {
          value: 'Able',
          fieldName: 'lastName',
        });
      });
      test('should update state when changes to email keyed', () => {
        component.instance().handleInputChange('email', 'gmail.com');
        assertComponentHasExpectedProps(findDataTest(component, 'email-input'), {
          value: 'gmail.com',
          fieldName: 'email',
        });
      });
    });
  });
  test('should call passed function with search criteria when find is clicked', () => {
    const component = shallow(
      <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} />,
    );
    component.instance().handleInputChange('firstName', 'Able');
    component.instance().handleInputChange('lastName', 'Seaman');
    component.instance().handleInputChange('email', 'Pig');

    findDataTest(component, 'search-form').simulate('submit');
    expect(getCustomerList).toBeCalledTimes(1);
    expect(getCustomerList).toBeCalledWith('Able', 'Seaman', 'Pig');
  });
});
