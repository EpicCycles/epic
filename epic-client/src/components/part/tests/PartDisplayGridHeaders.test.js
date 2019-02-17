import React from 'react';
import PartDisplayGridHeaders from "../PartDisplayGridHeaders";

test('should display just part headers when supplier products no requested', () => {
    const component = shallow(<PartDisplayGridHeaders/>);
    expect(component).toMatchSnapshot();
});
test('should display all headers with locking and an extra class', () => {
    const component = shallow(<PartDisplayGridHeaders
        lockFirstColumn={true}
        showSupplierProducts={true}
        showErrors={true}
        className={"pink"}
    />);
    expect(component).toMatchSnapshot();
});
test('should display all headers with locking and an extra class and actions', () => {
    const component = shallow(<PartDisplayGridHeaders
        lockFirstColumn={true}
        showSupplierProducts={true}
        showErrors={true}
        className={"pink"}
        includeActions={true}
    />);
    expect(component).toMatchSnapshot();
});