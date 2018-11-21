import React from 'react';
import Header from "../../../components/menus/Header";

// props are user, application, removeMessage
describe("Header.index tests", () => {
    it('renders the Header correctly when the user is not logged in', () => {
        const header = shallow(<Header/>);
        expect(header).toMatchSnapshot();
    });
    it('renders the Header correctly when the user is logged in', () => {
        const user = {
            isAuthenticated: true,
            firstName: "Anna",
            lastName: "Weaver",
            username: "AVIW"
        };
        const application = {}
        ;const header = shallow(<Header user={user} application={application}/>);
        expect(header).toMatchSnapshot();
    });
    it('renders the Header correctly with user and application message ', () => {
        const user = {
            isAuthenticated: true,
            firstName: "Anna",
            lastName: "Weaver",
            username: "AVIW"
        };
        const application = {
            messageType: "E",
            message: "show me a message"
        };
        const removeMessage = jest.fn();
        const header = shallow(<Header user={user} application={application} removeMessage={removeMessage}/>);
        expect(header).toMatchSnapshot();
    });
});
