export const attributeOptionTypes = [
    {value: '1', name: 'Text', isDefault: true},
    {value: '2', name: 'Numeric'},
    {value: '3', name: 'Single - Radio'},
    {value: '4', name: 'Single - Dropdown'},
    {value: '5', name: 'Multiple - Radio'},
    {value: '6', name: 'Multiple - Dropdown'},
];

export const NEW_ELEMENT_ID = "new";

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
        ]
    },

];

export const colourStyles = [
    {background: "bg-col-01", colour: "col-01", border: "border-col-01"},
    {background: "bg-col-02", colour: "col-02", border: "border-col-02", transition: "transition-01-02"},
    {background: "bg-col-03", colour: "col-03", border: "border-col-03", transition: "transition-02-03"},
    {background: "bg-col-04", colour: "col-04", border: "border-col-04", transition: "transition-03-04"},
    {background: "bg-col-05", colour: "col-05", border: "border-col-05", transition: "transition-04-05"},
    {background: "bg-col-06", colour: "col-06", border: "border-col-06", transition: "transition-05-06"},
    {background: "bg-col-07", colour: "col-07", border: "border-col-07", transition: "transition-06-07"},
    {background: "bg-col-08", colour: "col-08", border: "border-col-08", transition: "transition-07-08"},
    {background: "bg-col-09", colour: "col-09", border: "border-col-09", transition: "transition-08-09"},
    {background: "bg-col-10", colour: "col-10", border: "border-col-10", transition: "transition-09-10"},
    {background: "bg-col-11", colour: "col-11", border: "border-col-11", transition: "transition-10-11"},
    {background: "bg-col-12", colour: "col-12", border: "border-col-12", transition: "transition-11-12"},
    {background: "bg-col-13", colour: "col-13", border: "border-col-13", transition: "transition-12-13"},
];