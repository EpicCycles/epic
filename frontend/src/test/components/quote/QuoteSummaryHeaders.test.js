import React from 'react';

import QuoteSummaryHeaders from '../../../components/quote/QuoteSummaryHeaders';
import { findDataTest } from '../../jest_helpers/assert';

describe('QuoteSummaryHeaders', () => {
  it('should not show price fields when not required', () => {
    const component = shallow(<QuoteSummaryHeaders />);
    expect(findDataTest(component, 'part-type-header')).toHaveLength(1);
    expect(findDataTest(component, 'part-header')).toHaveLength(1);
    expect(component.find('ModelTableHeaders')).toHaveLength(0);
  });
  it('should  show price fields when not required', () => {
    const component = shallow(<QuoteSummaryHeaders showPrices />);
    expect(findDataTest(component, 'part-type-header')).toHaveLength(1);
    expect(findDataTest(component, 'part-header')).toHaveLength(1);
    expect(component.find('ModelTableHeaders')).toHaveLength(1);
  });
});
