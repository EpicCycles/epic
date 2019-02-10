import React from 'react';
import ErrorHeader from "../ErrorHeader";

test('should display error header', () => {
    const component = shallow(<ErrorHeader/>);
    expect(component).toMatchSnapshot();
});
test('should display error header with locking and an extra class', () => {
    const component = shallow(<ErrorHeader lockedColumn={true} className={"pink"}/>);
    expect(component).toMatchSnapshot();
});