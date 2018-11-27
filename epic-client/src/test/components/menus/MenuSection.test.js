import React from 'react';
import MenuSection from "../../../components/menus/MenuSection";

test("it displays correctly", () => {
    const sectionContents = [
        {
            groupHeader: "Customer",
            groupLinks: [
                { displayText: "Find Customer", linkRoute: "/customer-search", linkNumber: 1  },
                { displayText: "New Customer", linkRoute: "/customer", linkNumber: 2 },
                ]
        },
             {
                groupHeader: "Core Data",
                groupLinks: [
                    { displayText: "Quote Sections", linkRoute: "/framework", linkNumber: 3 },
                    { displayText: "Brands", linkRoute: "/brands", linkNumber: 4 },
                ]
            },
        ];
    const component = shallow(<MenuSection
        sectionContents={sectionContents}
    />);
    expect(component).toMatchSnapshot();
});