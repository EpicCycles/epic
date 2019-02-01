import React from "react";
import Login from "../Login";

test("displays login fields when user in session", () => {
    const component = shallow(<Login user={{username: "testUser"}}s/>);
    expect(component).toMatchSnapshot();
});
test("displays login fields when no user in session", () => {
    const component = shallow(<Login />);
    expect(component).toMatchSnapshot();
});