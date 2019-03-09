import React from 'react';
import AdditionalHeader from "../AdditionalHeader";

test('should display error header', () => {
    const component = shallow(<AdditionalHeader headerText={'Errors'}/>);
    expect(component).toMatchSnapshot();
});
test('should display error header with locking and an extra class', () => {
    const component = shallow(<AdditionalHeader headerText={'Errors'} lockedColumn={true} className={"pink"}/>);
    expect(component).toMatchSnapshot();
});