import React from 'react';
import toJson from 'enzyme-to-json';
import FrameworkMoves from '../../../components/framework/FrameworkMoves';

test('FrameworkMoves displays and right methods are called', () => {
  const componentKey = '21';
  const moveToTop = jest.fn();
  const moveUp = jest.fn();
  const moveDown = jest.fn();
  const moveToBottom = jest.fn();
  const component = shallow(
    <FrameworkMoves
      componentKey={componentKey}
      moveToTop={moveToTop}
      moveUp={moveUp}
      moveDown={moveDown}
      moveToBottom={moveToBottom}
    />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
