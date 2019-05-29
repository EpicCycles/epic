import React from 'react';
import toJson from 'enzyme-to-json';
import CountrySelect from '../../../components/address/CountrySelect';

describe('CountrySelect', () => {
  test('it renders with GB selected as a default', () => {
    const component = shallow(<CountrySelect onChange={jest.fn()} />);
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it renders with country selected', () => {
    const component = shallow(<CountrySelect countrySelected="DE" onChange={jest.fn()} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
