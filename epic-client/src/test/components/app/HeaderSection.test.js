import React from 'react';
import HeaderSection from "../../../components/menus/HeaderSection";

// props are user, application, removeMessage
describe("HeaderSection.index tests", () => {
    it('renders the HeaderSection correctly', () => {
        const sectionContents = [
            {
                groupHeader: "Customer",
                groupLinks: [
                    { displayText: "Find Customer", linkRoute: "/customer-search" },
                    { displayText: "New Customer", linkRoute: "/customer" },
                ]
            },
            {
                groupHeader: "Core Data",
                groupLinks: [
                    { displayText: "Quote Sections", linkRoute: "/framework" },
                    { displayText: "Brands", linkRoute: "/brands" },
                ]
            },
        ];
        const headerSection = shallow(<HeaderSection sectionContents={sectionContents} />);
        expect(headerSection).toMatchSnapshot();
    });

});
