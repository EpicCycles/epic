import React from "react";
import PasswordChange from "../PasswordChange";

test("displays correctly", () => {
    const component = shallow(<PasswordChange />)
    expect(component).toMatchSnapshot();
})