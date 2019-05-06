import React from 'react';
import DisplayBlock from '../DisplayBlock';
import { findDataTest } from '../../../../test/jest_helpers/assert';

describe('DisplayBlock', () => {
  it('should return null when no arrray is passed', () => {
    const component = shallow(<DisplayBlock />);
    expect(component).toEqual({});
  });
  it('should return null when an empty arrray is passed', () => {
    const component = shallow(<DisplayBlock arrayOfThings={[]} />);
    expect(component).toEqual({});
  });
  it('should return a single div when a single element arrray is passed', () => {
    const component = shallow(<DisplayBlock arrayOfThings={['thing 1']} />);
    expect(findDataTest(component, 'block-container')).toHaveLength(0);
    expect(findDataTest(component, 'block-element')).toHaveLength(1);
  });
  it('should return a container div when a single element arrray is passed', () => {
    const component = shallow(<DisplayBlock arrayOfThings={['thing 1', 'thing 2']} />);
    expect(findDataTest(component, 'block-container')).toHaveLength(1);
    expect(findDataTest(component, 'block-element')).toHaveLength(2);
  });
});
