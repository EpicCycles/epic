import React from 'react';
import CustomerListGridHeaders from '../CustomerListGridHeaders';
import { findDataTest } from '../../../../../test/jest_helpers/assert';

describe('CustomerListGridHeaders', () => {
  it('should show just fields when no other parts are requested', () => {
    const component = shallow(<CustomerListGridHeaders />);
    expect(findDataTest(component, 'customer-field-headers')).toHaveLength(1);
    expect(findDataTest(component, 'customer-actions')).toHaveLength(0);
    expect(findDataTest(component, 'customer-errors')).toHaveLength(0);
  });
  it('should show error column when errors are requested', () => {
    const component = shallow(<CustomerListGridHeaders showErrors />);
    expect(findDataTest(component, 'customer-field-headers')).toHaveLength(1);
    expect(findDataTest(component, 'customer-actions')).toHaveLength(0);
    expect(findDataTest(component, 'customer-errors')).toHaveLength(1);
  });
  it('should show fields and actions when actions are requested', () => {
    const component = shallow(<CustomerListGridHeaders includeActions />);
    expect(findDataTest(component, 'customer-field-headers')).toHaveLength(1);
    expect(findDataTest(component, 'customer-actions')).toHaveLength(1);
    expect(findDataTest(component, 'customer-errors')).toHaveLength(0);
  });
  it('should show fields, errors and actions when actions and errors are requested', () => {
    const component = shallow(<CustomerListGridHeaders includeActions showErrors />);
    expect(findDataTest(component, 'customer-field-headers')).toHaveLength(1);
    expect(findDataTest(component, 'customer-actions')).toHaveLength(1);
    expect(findDataTest(component, 'customer-errors')).toHaveLength(1);
  });
});
