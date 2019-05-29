import React from 'react';
import ModelTableHeaders from '../../../components/app/model/ModelTableHeaders';
import { customerFields } from '../../../components/app/model/helpers/fields';
import { findDataTest } from '../../jest_helpers/assert';

describe('ModelTableHeaders', () => {
  it('should show all the headers when a model has fields', () => {
    const component = shallow(<ModelTableHeaders modelFields={customerFields} />);
    expect(findDataTest(component, 'model-field-header')).toHaveLength(customerFields.length);
  });
});
