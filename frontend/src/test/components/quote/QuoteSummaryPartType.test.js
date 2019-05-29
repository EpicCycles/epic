import React from 'react';
import QuoteSummaryPartType from '../../../components/quote/QuoteSummaryPartType';
import { findDataTest } from '../../jest_helpers/assert';

describe('QuoteSummaryPartType', () => {
  const bikePart = { brand_name: 'Brand 1', part_name: 'Bike Part' };
  const quotePart = { part: 6, quote_price: 0 };
  const replacementPart = { id: 6, brand_name: 'Brand 2', part_name: 'other Part' };
  const additionalParts = [
    { id: 22, part: 6, quote_price: 23.0 },
    { id: 32, part: 26, quote_price: 23.0 },
  ];
  const parts = [
    { id: 6, brand_name: 'Brand 2', part_name: 'other Part' },
    { id: 26, brand_name: 'Brand 2', part_name: 'other Part2' },
  ];
  const partType = { name: 'show Me' };
  it('should show bike part when bike part is present', () => {
    const component = shallow(
      <QuoteSummaryPartType
        showPrices
        partType={partType}
        bikePart={bikePart}
        quotePart={quotePart}
        replacementPart={replacementPart}
      />,
    );
    expect(findDataTest(component, 'bike-part-type-cell')).toHaveLength(1);
    expect(findDataTest(component, 'bike-part-cell')).toHaveLength(1);
    expect(findDataTest(component, 'additional-part-type-cell')).toHaveLength(0);
    expect(findDataTest(component, 'additional-part-cell')).toHaveLength(0);
    expect(component.find('ModelViewRow')).toHaveLength(1);
  });
  it('should show additional parts when they are present', () => {
    const component = shallow(
      <QuoteSummaryPartType
        showPrices
        partType={partType}
        bikePart={bikePart}
        quotePart={quotePart}
        replacementPart={replacementPart}
        additionalParts={additionalParts}
        parts={parts}
      />,
    );

    expect(findDataTest(component, 'bike-part-type-cell')).toHaveLength(1);
    expect(findDataTest(component, 'bike-part-cell')).toHaveLength(1);
    expect(findDataTest(component, 'additional-part-type-cell')).toHaveLength(2);
    expect(findDataTest(component, 'additional-part-cell')).toHaveLength(2);
    expect(component.find('ModelViewRow')).toHaveLength(3);
  });
  it('should show additional parts only and no preices when they are present', () => {
    const component = shallow(
      <QuoteSummaryPartType partType={partType} additionalParts={additionalParts} parts={parts} />,
    );

    expect(findDataTest(component, 'bike-part-type-cell')).toHaveLength(0);
    expect(findDataTest(component, 'bike-part-cell')).toHaveLength(0);
    expect(findDataTest(component, 'additional-part-type-cell')).toHaveLength(2);
    expect(findDataTest(component, 'additional-part-cell')).toHaveLength(2);
    expect(component.find('ModelViewRow')).toHaveLength(0);
  });
});
