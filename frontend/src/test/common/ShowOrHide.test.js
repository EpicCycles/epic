import React from 'react';
import toJson from 'enzyme-to-json';
import ShowOrHide from '../../common/ShowOrHide';

describe('ShowOrHide', () => {
  test('it renders without failing', () => {
    const hideDetail = jest.fn();
    const showDetail = jest.fn();
    const component = shallow(
      <ShowOrHide
        componentKey="mykey"
        isShown={false}
        hideDetail={hideDetail}
        showDetail={showDetail}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('it calls hide when details shown and icon clicked', () => {
    const hideDetail = jest.fn();
    const showDetail = jest.fn();
    const component = shallow(
      <ShowOrHide
        componentKey="mykey"
        isShown={false}
        hideDetail={hideDetail}
        showDetail={showDetail}
      />,
    );

    expect(component.find('#mykey')).toHaveLength(1);
    component.find('#mykey').simulate('click');
    expect(showDetail).toBeCalled();
  });
});
