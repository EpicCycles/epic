import React from 'react';
import FrameworkMoves from "../../../containers/framework/FrameworkMoves";
test('FrameworkMoves displays and right methods are called', () => {
    const componentKey = "21";
    const moveToTop = jest.fn();
    const moveUp = jest.fn();
    const moveDown = jest.fn();
    const moveToBottom = jest.fn();
    const component = shallow(<FrameworkMoves
        componentKey={componentKey}
        moveToTop={moveToTop}
        moveUp={moveUp}
        moveDown={moveDown}
        moveToBottom={moveToBottom}
    />);
    expect(component).toMatchSnapshot();
});
