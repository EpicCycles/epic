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
                    { displayText: "Find Customer", linkRoute: "/customer-search" },
                    { displayText: "New Customer", linkRoute: "/customer" },
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
                    { displayText: "Quote Sections", linkRoute: "/framework" },
                    { displayText: "Brands", linkRoute: "/brands" },
                ]
            },
        ]
    },

];

export const colourStyles = [
    { background: "bg-navy", colour: "white", border: "border--navy" },
    { background: "bg-olive", colour: "white", border: "border--olive" },
    { background: "bg-gray", colour: "white", border: "border--gray" },
    { background: "bg-blue", colour: "white", border: "border--blue" },
    { background: "bg-green", colour: "white", border: "border--green" },
    { background: "bg-yellow", colour: "black", border: "border--yellow" },
    { background: "bg-fuchsia", colour: "white", border: "border--fuchsia" },
    { background: "bg-aqua", colour: "black", border: "border--aqua" },
    { background: "bg-lime", colour: "white", border: "border--lime" },
    { background: "bg-orange", colour: "white", border: "border--orange" },
    { background: "bg-purple", colour: "white", border: "border--purple" },
    { background: "bg-teal", colour: "white", border: "border--teal" },
    { background: "bg-maroon", colour: "white", border: "border--maroon" },
    { background: "bg-black", colour: "white", border: "border--black" }
];