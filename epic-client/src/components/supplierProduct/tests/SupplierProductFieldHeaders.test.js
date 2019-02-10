import React from 'react';
import SupplierProductFieldHeaders from "../SupplierProductFieldHeaders";

test('should display headers', () => {
    const component = shallow(<SupplierProductFieldHeaders/>);
    expect(component).toMatchSnapshot();
});
test('should display headers with locking, error and an extra class', () => {
    const component = shallow(<SupplierProductFieldHeaders
        lockFirstColumn={true}
        className={"pink"}
        showErrors={true}
    />);
    expect(component).toMatchSnapshot();
});