import React from "react";
import PasswordChange from "../PasswordChange";

test("displays correctly", () => {
    const component = shallow(<PasswordChange
        changePassword={jest.fn()}
    />)
    expect(component).toMatchSnapshot();
})