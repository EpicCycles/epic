import React from "react";
import CountrySelect from "../../common/CountrySelect";

test('it renders with GB selected as a default', () => {
    const component = shallow(<CountrySelect
        onChange={jest.fn()}
    />);
    expect(component).toMatchSnapshot();
});
test('it renders with country selected', () => {
    const component = shallow(<CountrySelect
        countrySelected="DE"
        onChange={jest.fn()}
    />);
    expect(component).toMatchSnapshot();
});