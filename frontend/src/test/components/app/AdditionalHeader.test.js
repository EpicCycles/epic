import React from 'react';
import toJson from 'enzyme-to-json';
import AdditionalHeader from "../../../components/app/model/AdditionalHeader";

describe('AdditionalHeader', () => {
  test('should display error header', () => {
    const component = shallow(<AdditionalHeader headerText="Errors" />);
    expect(toJson(component)).toMatchSnapshot();
  });
  test('should display error header with locking and an extra class', () => {
    const component = shallow(
      <AdditionalHeader headerText="Errors" lockedColumn className="pink" />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
