import React from "react";
import UserDetailChange from "../UserDetailChange";

test("displays correctly", () => {
    const component = shallow(<UserDetailChange />)
    expect(component).toMatchSnapshot();
});
test("displays correctly with a user", () => {
    const user = {user: {
        username: 'fred',
        first_name: 'Frederick',
        last_name: 'Jones,',
        email: 'fred@fred.jones.org'
    }}
    const component = shallow(<UserDetailChange
    user={user}/>);
    expect(component).toMatchSnapshot();
});