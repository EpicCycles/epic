export const attributeOptionTypes = [
    { value: '1', name: 'Text', isDefault: true },
    { value: '2', name: 'Numeric' },
    { value: '3', name: 'Single - Radio' },
    { value: '4', name: 'Single - Dropdown' },
    { value: '5', name: 'Multiple - Radio' },
    { value: '6', name: 'Multiple - Dropdown' },
];

export const NEW_ELEMENT_ID = "new";

export const menuStructure = [
    {
        sectionPos: 1,
        sectionContents: [
            {
                groupHeader: "Customer",
                groupLinks: [
                    { displayText: "Find Customer", linkRoute: "/customer-search", linkNumber: 1 },
                    { displayText: "New Customer", linkRoute: "/customer", linkNumber: 2 },
                ]
            },
        ]
    },
    {
        sectionPos: 2,
        sectionContents: [
            {
                groupHeader: "Core Data",
                groupLinks: [
                    { displayText: "Quote Sections", linkRoute: "/framework", linkNumber: 3 },
                    { displayText: "Brands", linkRoute: "/brands", linkNumber: 4 },
                ]
            },
        ]
    },

];

export const colourStyles = [
    { background: "bg-col-01", colour: "col-01", border: "border-col-01" },
    { background: "bg-col-02", colour: "col-02", border: "border-col-02" },
    { background: "bg-col-03", colour: "col-03", border: "border-col-03" },
    { background: "bg-col-04", colour: "col-04", border: "border-col-04" },
    { background: "bg-col-05", colour: "col-05", border: "border-col-05" },
    { background: "bg-col-06", colour: "col-06", border: "border-col-06" },
    { background: "bg-col-07", colour: "col-07", border: "border-col-07" },
    { background: "bg-col-08", colour: "col-08", border: "border-col-08" },
    { background: "bg-col-09", colour: "col-09", border: "border-col-09" },
    { background: "bg-col-10", colour: "col-10", border: "border-col-10" },
    { background: "bg-col-11", colour: "col-11", border: "border-col-11" },
    { background: "bg-col-12", colour: "col-12", border: "border-col-12" },
    { background: "bg-col-13", colour: "col-13", border: "border-col-13" },
];