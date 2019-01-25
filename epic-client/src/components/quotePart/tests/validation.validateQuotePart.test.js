import {validateQuotePart} from "../helpers/validation";

const sections = [
    {
        id: 1,
        name: 'Frameset',
        placing: 10,
        partTypes: [
            {
                id: 1,
                attributes: [],
                synonyms: [],
                name: 'Frame',
                placing: 10,
                can_be_substituted: false,
                can_be_omitted: false,
                customer_visible: true,
                includeInSection: 1
            },
            {
                id: 2,
                attributes: [
                    {
                        id: 1,
                        options: [],
                        attribute_name: 'Diameter',
                        in_use: true,
                        mandatory: false,
                        placing: 10,
                        attribute_type: '1',
                        partType: 2
                    }
                ],
                synonyms: [],
                name: 'Seat Clamp',
                placing: 20,
                can_be_substituted: true,
                can_be_omitted: true,
                customer_visible: false,
                includeInSection: 1
            },
        ]
    },
    {
        id: 2,
        name: 'Groupset',
        placing: 20,
        partTypes: [
            {
                id: 9,
                attributes: [
                    {
                        id: 4,
                        options: [
                            {
                                id: 1,
                                option_name: 'Braze',
                                placing: 10,
                                part_type_attribute: 4
                            },
                            {
                                id: 2,
                                option_name: 'Band',
                                placing: 20,
                                part_type_attribute: 4
                            }
                        ],
                        attribute_name: 'Braze/Band',
                        in_use: true,
                        mandatory: true,
                        placing: 10,
                        attribute_type: '3',
                        partType: 9
                    },
                    {
                        id: 16,
                        options: [
                            {
                                id: 6,
                                option_name: 'Short',
                                placing: 10,
                                part_type_attribute: 16
                            },
                            {
                                id: 7,
                                option_name: 'Medium',
                                placing: 20,
                                part_type_attribute: 16
                            }
                        ],
                        attribute_name: 'Cage',
                        in_use: true,
                        mandatory: true,
                        placing: 10,
                        attribute_type: '6',
                        partType: 10
                    }
                ],
                synonyms: [],
                name: 'Rear Mech',
                placing: 40,
                can_be_substituted: true,
                can_be_omitted: true,
                customer_visible: false,
                includeInSection: 2
            },
            {
                id: 12,
                attributes: [
                    {
                        id: 5,
                        options: [],
                        attribute_name: 'Diameter',
                        in_use: true,
                        mandatory: true,
                        placing: 10,
                        attribute_type: '1',
                        partType: 12
                    }
                ],
                synonyms: [
                    {
                        id: 2,
                        name: 'Rotors',
                        partType: 12
                    }
                ],
                name: 'Brake Rotors',
                placing: 60,
                can_be_substituted: true,
                can_be_omitted: true,
                customer_visible: false,
                includeInSection: 2
            },
            {
                id: 14,
                attributes: [
                    {
                        id: 15,
                        options: [],
                        attribute_name: 'Cassette Ratio',
                        in_use: true,
                        mandatory: true,
                        placing: 10,
                        attribute_type: '1',
                        partType: 14
                    },
                    {
                        id: 14,
                        options: [],
                        attribute_name: 'BB Type',
                        in_use: true,
                        mandatory: false,
                        placing: 10,
                        attribute_type: '1',
                        partType: 15
                    },
                    {
                        id: 2,
                        options: [],
                        attribute_name: 'Length',
                        in_use: true,
                        mandatory: true,
                        placing: 10,
                        attribute_type: '1',
                        partType: 7
                    },
                    {
                        id: 3,
                        options: [],
                        attribute_name: 'Ratio',
                        in_use: true,
                        mandatory: true,
                        placing: 20,
                        attribute_type: '1',
                        partType: 7
                    }
                ],
                synonyms: [],
                name: 'Chainset',
                placing: 110,
                can_be_substituted: true,
                can_be_omitted: true,
                customer_visible: false,
                includeInSection: 2
            },
        ]
    },
    {
        id: 3,
        name: 'Wheelset',
        placing: 30,
        partTypes: [
            {
                id: 171,
                attributes: [
                    {
                        id: 13,
                        options: [],
                        attribute_name: 'Colour',
                        in_use: true,
                        mandatory: false,
                        placing: 10,
                        attribute_type: '1',
                        partType: 17
                    },
                    {
                        id: 12,
                        options: [],
                        attribute_name: 'Baldness',
                        in_use: true,
                        mandatory: false,
                        placing: 10,
                        attribute_type: '1',
                        partType: 18
                    },
                    {
                        id: 17,
                        options: [],
                        attribute_name: 'Size',
                        in_use: true,
                        mandatory: true,
                        placing: 20,
                        attribute_type: '1',
                        partType: 18
                    },
                    {
                        id: 11,
                        options: [
                            {
                                id: 3,
                                option_name: 'Short',
                                placing: 10,
                                part_type_attribute: 11
                            },
                            {
                                id: 4,
                                option_name: 'Medium',
                                placing: 20,
                                part_type_attribute: 11
                            },
                            {
                                id: 5,
                                option_name: 'Long',
                                placing: 30,
                                part_type_attribute: 11
                            },
                            {
                                id: 8,
                                option_name: 'Extra Long',
                                placing: 40,
                                part_type_attribute: 11
                            }
                        ],
                        attribute_name: 'Valve Length',
                        in_use: true,
                        mandatory: false,
                        placing: 10,
                        attribute_type: '4',
                        partType: 19
                    }
                ],
                synonyms: [],
                name: 'Tubes',
                placing: 30,
                can_be_substituted: true,
                can_be_omitted: true,
                customer_visible: false,
                includeInSection: 3
            },
        ]
    },
];

test('part and replacement part with trade in price no errors', () => {
    const quotePart = {
        quote: 1,
        partType: 1,
        part: 16,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        part: 16,
        partType: 1,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
        error: [],
        error_detail: {},
    };
    const bike_parts = [
        { partType: 1, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});
test('replacement part with trade in price no errors', () => {
    const quotePart = {
        quote: 1,
        partType: 1,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        partType: 1,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
        error: [],
        error_detail: {},
    };
    const bike_parts = [
        { partType: 1, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});
test('part and replacement part with no trade in price error', () => {
    const quotePart = {
        quote: 1,
        partType: 1,
        part: 16,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        replacement_part: true,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        part: 16,
        partType: 1,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        replacement_part: true,
        quote_part_attributes: [],
        error: [],
        error_detail: { trade_in_price: ["A trade in price must be keyed (can be zero)."] },
    };
    const bike_parts = [
        { partType: 1, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});
test('no part and replacement part not on bike spec - error', () => {
    const quotePart = {
        quote: 1,
        partType: 1,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        partType: 1,
        trade_in_price: 10.30,
        replacement_part: true,
        quote_part_attributes: [],
        error: [],
        error_detail: {
            replacement_part: ["No matching part on bike specification."]
        },
    };
    const bike_parts = [
        { partType: 14, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});
test('no part and rrp - error', () => {
    const quotePart = {
        quote: 1,
        partType: 1,
        trade_in_price: 10.30,
        rrp: 30.00,
        quantity: 2,
        epic_price: 30.00,
        club_price: 30.00,
        replacement_part: true,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        partType: 1,
        trade_in_price: 10.30,
        rrp: 30.00,
        quantity: 2,
        epic_price: 30.00,
        club_price: 30.00,
        replacement_part: true,
        quote_part_attributes: [],
        error: [],
        error_detail: {
            rrp: ["No prices or quantities should be entered if there is no part"],
            quantity: ["No prices or quantities should be entered if there is no part"],
            epic_price: ["No prices or quantities should be entered if there is no part"],
            club_price: ["No prices or quantities should be entered if there is no part"],
        },
    };
    const bike_parts = [
        { partType: 1, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});
test('part and not replacement part with trade in price', () => {
    const quotePart = {
        quote: 1,
        partType: 1,
        part: 16,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        trade_in_price: 10.30,
        replacement_part: false,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        part: 16,
        partType: 1,
        quantity: 1,
        rrp: 12.99,
        epic_price: 11.50,
        trade_in_price: 10.30,
        replacement_part: false,
        quote_part_attributes: [],
        error: [],
        error_detail: {trade_in_price:["Trade in price only valid when this is a replacement part"]},
    };
    const bike_parts = [
        { partType: 1, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});

test('part with missing data', () => {
    const quotePart = {
        quote: 1,
        partType: 171,
        part: 16,
        epic_price: 11.50,
        quote_part_attributes: [],
    };
    const quotePartExpected = {
        quote: 1,
        part: 16,
        partType: 171,
        epic_price: 11.50,
        quote_part_attributes: [],
        error: ["Attributes need to be completed"],
        error_detail: {
            rrp: ["At least an RRP must be provided for the part"],
            quantity: ["A value is required."]
        },
    };
    const bike_parts = [
        { partType: 1, part: 23 },
    ];
    expect(validateQuotePart(quotePart, bike_parts, sections)).toEqual(quotePartExpected);
});
