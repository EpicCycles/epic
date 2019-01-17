export const menuStructure = [
    {
        sectionPos: 1,
        sectionContents: [
            {
                groupHeader: "Customer",
                groupPos: 10,
                groupLinks: [
                    {displayText: "Find Customer", linkRoute: "/customer-search", linkNumber: 101},
                    {displayText: "New Customer", linkRoute: "/customer", linkNumber: 102},
                ]
            },
        ]
    },
    {
        sectionPos: 2,
        sectionContents: [
            {
                groupHeader: "Bikes",
                groupPos: 20,
                groupLinks: [
                    {displayText: "Bike Upload", linkRoute: "/bike-upload", linkNumber: 201},
                    {displayText: "Bike Review", linkRoute: "/bike-review-list", linkNumber: 202},
                ]
            },
            {
                groupHeader: "Core Data",
                groupPos: 21,
                groupLinks: [
                    {displayText: "Quote Sections", linkRoute: "/framework", linkNumber: 211},
                    {displayText: "Brands", linkRoute: "/brands", linkNumber: 212},
                ]
            },
            {
                groupHeader: "Products",
                groupPos: 22,
                groupLinks: [
                    { displayText: "Product Upload", linkRoute: "/product-upload", linkNumber: 221 },
                    { displayText: "Product Review", linkRoute: "/product-review", linkNumber: 222 },
                ]
            },
        ]
    },

];
