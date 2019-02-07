export const sampleBrands = [
    { brand_name: "sbrand1", supplier: 1, id: 1 },
    { brand_name: "abrand2", supplier: 1, id: 2 },
    { brand_name: "dbrand3", supplier: 1, id: 3 },
    { brand_name: "fbrand4", supplier: 1, id: 4 },
    { brand_name: "hbrand5", supplier: 1, id: 5 },
    { brand_name: "jbrand6", supplier: 2, id: 6 },
    { brand_name: "kbrand7", supplier: 2, id: 7 },
    { brand_name: "Bianchi", link: "https://bianchi.co.uk", id: 8 },
    { brand_name: "rbrand1", supplier: 1, id: 11 },
    { brand_name: "brand2", supplier: 1, id: 12 },
    { brand_name: "brand3", supplier: 1, id: 13 },
    { brand_name: "brand4", supplier: 1, id: 14 },
    { brand_name: "brand5", supplier: 1, id: 15 },
    { brand_name: "brand6", supplier: 2, id: 16 },
    { brand_name: "brand7", supplier: 12, id: 17 },
    { brand_name: "brand8", link: "https://bianchi.co.uk", id: 18 },
];
export const sampleFrames = [
    {
        "id": 14,
        "brand_name": "Haibike",
        "frame_name": "Trekking",
        "archived": false,
        "archived_date": null,
        "brand": 3
    },
    {
        "id": 13,
        "brand_name": "Haibike",
        "frame_name": "Urban",
        "archived": false,
        "archived_date": null,
        "brand": 3
    },
    {
        "id": 27,
        "brand_name": "Raleigh",
        "frame_name": "Motus",
        "archived": false,
        "archived_date": null,
        "brand": 4
    }
];

export const sampleBikes =  [
    {
        "id": 58,
        "frame_name": "Haibike: Trekking",
        "model_name": "4",
        "description": null,
        "colours": "anthracite/black/lime",
        "rrp": null,
        "epic_price": null,
        "club_price": "2249.00",
        "sizes": null,
        "frame": 14
    },
    {
        "id": 59,
        "frame_name": "Haibike: Trekking",
        "model_name": "4 low-step",
        "description": null,
        "colours": "anthracite/black/lime",
        "rrp": null,
        "epic_price": null,
        "club_price": "2249.00",
        "sizes": null,
        "frame": 14
    },
    {
        "id": 60,
        "frame_name": "Haibike: Trekking",
        "model_name": "5",
        "description": null,
        "colours": "black/blue/white matt",
        "rrp": null,
        "epic_price": null,
        "club_price": "2549.00",
        "sizes": null,
        "frame": 14
    },
    ];
export const sampleSuppliers = [
    { supplier_name: "Supplier1", id: 1 },
    { supplier_name: "Supplier2fdg", id: 2 },
    { supplier_name: "Supplier3 dfgdfg", id: 3 },
    { supplier_name: "Supplier3 dfgdfg", id: 4 },
    { supplier_name: "Supplier3 dfgdfg", id: 5 },
    { supplier_name: "Supplier3", id: 6 },
    { supplier_name: "Supplier3 dfgdfg", id: 7 },
    { supplier_name: "Supplier3", id: 8 },
    { supplier_name: "Supplier3 sdfgsdg", id: 9 },
    { supplier_name: "Supplier3 dsdfg", id: 10 },
    { supplier_name: "Supplier3 dsgdsg", id: 11 },
    { supplier_name: "Supplier3 sdfgs", id: 12 },
    { supplier_name: "Supplier3 sdgfsdfg", id: 13 },
    { supplier_name: "Supplier3 sgsdf", id: 14 }
];

export const sampleSections = [
    {
        "id": 1,
        "name": "Frameset",
        "placing": 10,
        "partTypes": [
            {
                "id": 1,
                "attributes": [
                    {
                        "id": 1,
                        "options": [],
                        "attribute_name": "Size",
                        "in_use": true,
                        "mandatory": true,
                        "placing": 10,
                        "attribute_type": "1",
                        "partType": 1
                    }
                ],
                "synonyms": [],
                "shortName": "Frame",
                "placing": 10,
                "can_be_substituted": true,
                "can_be_omitted": false,
                "customer_facing": false,
                "includeInSection": 1
            },
            {
                "id": 2,
                "attributes": [],
                "synonyms": [
                    {
                        "id": 1,
                        "shortName": "Front Fork",
                        "partType": 2
                    }
                ],
                "shortName": "Fork",
                "placing": 20,
                "can_be_substituted": false,
                "can_be_omitted": true,
                "customer_facing": false,
                "includeInSection": 1
            },
            {
                "id": 3,
                "attributes": [],
                "synonyms": [],
                "shortName": "Headset",
                "placing": 30,
                "can_be_substituted": false,
                "can_be_omitted": false,
                "customer_facing": true,
                "includeInSection": 1
            }
        ]
    }
];

export const sampleBike =
    {
        bike: {
            id: 57,
            frame_name: 'Haibike: Urban',
            model_name: '4',
            description: null,
            colours: 'titan/anthracite matt',
            rrp: '3700.00',
            sizes: null,
            frame: 13
        },
        parts: [
            {
                id: 65,
                part_name: 'A-Head Tapered Cartridge aluminium\r',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 3,
                brand: 3
            },
            {
                id: 73,
                part_name: 'aluminium 6061 Gravity Casting Interface hydroformed Tapered head tube quick-release 5 x 135mm disc brake Post Mount\r',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 1,
                brand: 3
            },
            {
                id: 74,
                part_name: 'Urban Race steel steerer tube 1 1/8 - 1 1/2 tapered quick release',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 2,
                brand: 3
            },
            {
                id: 80,
                part_name: 'Components TheBar ++ Topflat 740mm',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 20,
                brand: 3
            },
            {
                id: 81,
                part_name: 'Components TheStem ++ A-head Bar bore: 31.8mm 6˚',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 21,
                brand: 3
            },
            {
                id: 82,
                part_name: 'Components The seat post ++ patent 31.6mm',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 22,
                brand: 3
            },
            {
                id: 328,
                part_name: 'x-sync 18',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 4,
                brand: 5
            },
            {
                id: 329,
                part_name: 'SLX M7000 rapidfire',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 5,
                brand: 6
            },
            {
                id: 330,
                part_name: 'Deore XT M8000 Shadow Plus 11 speed',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 7,
                brand: 6
            },
            {
                id: 331,
                part_name: 'SLX M7000 aluminium',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 9,
                brand: 6
            },
            {
                id: 332,
                part_name: 'HG601',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 10,
                brand: 6
            },
            {
                id: 333,
                part_name: 'SLX M7000 11-42 teeth',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 11,
                brand: 6
            },
            {
                id: 334,
                part_name: 'Cobalt 1',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 18,
                brand: 8
            },
            {
                id: 335,
                part_name: 'Marathon Supreme 32-622 28 x 1.25 Reflective stripes',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 16,
                brand: 7
            },
            {
                id: 336,
                part_name: 'Light MTB',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 23,
                brand: 10
            },
            {
                id: 337,
                part_name: 'lock on grips Sport',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 24,
                brand: 11
            },
            {
                id: 338,
                part_name: 'Freeride Plattform Pedal',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 25,
                brand: 11
            },
            {
                id: 339,
                part_name: 'Intuvia',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 27,
                brand: 12
            },
            {
                id: 340,
                part_name: 'PowerPack 500 Wh',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 26,
                brand: 12
            },
            {
                id: 341,
                part_name: 'compact charger 2A',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 35,
                brand: 12
            },
            {
                id: 342,
                part_name: 'Performance Cruise 250W 60Nm 25km/h',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 34,
                brand: 12
            },
            {
                id: 343,
                part_name: 'SLX M7000 160mm 2-Kolben Scheibenbremse',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 42,
                brand: 6
            },
            {
                id: 344,
                part_name: 'SLX M7000 160mm 2-Kolben Scheibenbremse',
                trade_in_price: null,
                standard: false,
                stocked: false,
                partType: 40,
                brand: 6
            }
        ]
    };