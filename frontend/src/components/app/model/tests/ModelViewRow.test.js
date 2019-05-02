import React from 'react';
import ModelViewRow from '../ModelViewRow';
import { frameFields } from '../helpers/fields';
import ModelViewRowField from '../ModelViewRowField';
import { findDataTest } from '../../../../../../test/jest_helpers/assert';

describe('ModelViewRow', () => {
  const model = {
    id: 14,
    brand_name: 'Haibike',
    frame_name: 'Trekking',
    archived: false,
    archived_date: null,
    brand: 3,
  };
  it('should display a cell for each field', () => {
    const component = shallow(<ModelViewRow modelFields={frameFields} model={model} />);
    expect(findDataTest(component, 'model-field-cell')).toHaveLength(frameFields.length);
    expect(component.find(ModelViewRowField)).toHaveLength(frameFields.length);
  });
});
