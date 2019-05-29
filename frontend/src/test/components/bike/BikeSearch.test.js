import React from 'react';
import BikeSearch from '../../../components/bike/BikeSearch';
import { sampleBrands } from '../../../helpers/sampleData';

describe('BikeSearch', () => {
  it('should display frame name, brand select and archived selection when archived is allowed', () => {
    const component = shallow(
      <BikeSearch
        onChange={jest.fn()}
        onClick={jest.fn()}
        getFrameList={jest.fn()}
        brands={sampleBrands}
        canSelectArchived={true}
      />,
    );
    expect(component.find('SearchBlock')).toHaveLength(1);
  });
});
