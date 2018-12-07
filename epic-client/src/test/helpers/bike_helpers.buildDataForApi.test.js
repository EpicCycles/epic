import {buildDataForApi} from "../../helpers/bike_helpers";

test("single bike, part and attribute set", () => {
    const brand = 1;
    const brands = [];
    const frameName = "Frame thing";
    const rowMappings = [
        { rowIndex: 0, rowField: "sizes", bikeAttribute: "sizes" },
        { rowIndex: 1, rowField: "frame", partType: 12 },
        { rowIndex: 2, rowField: "mudguards", ignore: true },
    ];
    const uploadedHeaders = ["", "Bike1"];
    const uploadedData = [
        ["sizes", "52, 54, 56"],
        ["frame", "Frame description"],
        ["mudguards", "included"],
    ];
    const expectedData = {
        brand: brand,
        frame_name: frameName,
        bikes: [
            {
                model_name: uploadedHeaders[1],
                sizes: uploadedData[0][1],
                parts: [
                    { partBrand: brand, partType: rowMappings[1].partType, partName: uploadedData[1][1] }
                ]
            }
        ]
    };
    expect(buildDataForApi(brand, frameName, rowMappings, uploadedHeaders, uploadedData, brands)).toEqual(expectedData);
});
test("multiple bikes, parts and attributes set", () => {
    const brand = 1;
    const brands = [
        {id: 1, brand_name: "Well"},
        {id: 2, brand_name: "Wellgo"},
    ];
    const frameName = "Frame thing";
    const rowMappings = [
        { rowIndex: 0, rowField: "sizes", bikeAttribute: "sizes" },
        { rowIndex: 1, rowField: "frame", partType: 12 },
        { rowIndex: 2, rowField: "mudguards", ignore: true },
        { rowIndex: 3, rowField: "description", bikeAttribute: "description" },
        { rowIndex: 4, rowField: "Bottom bracket", partType: 14 },
    ];
    const uploadedHeaders = ["", "Bike1", "Bike21", "Bike31"];
    const uploadedData = [
        ["sizes", "52, 54, 56"],
        ["frame", "Frame description 1", "Frame description 2"],
        ["mudguards", "included", "", ""],
        ["description", "bike 1 desc", "", "bike 3 desc", "bike 4 ignored"],
        ["Bottom bracket", "", "WellGo Push fit 2", "Well Push fit 3"],
    ];
    const expectedData = {
        brand: brand,
        frame_name: frameName,
        bikes: [
            {
                model_name: uploadedHeaders[1],
                sizes: uploadedData[0][1],
                description: uploadedData[3][1],
                parts: [
                    { partBrand: brand, partType: rowMappings[1].partType, partName: uploadedData[1][1] }
                ]
            },
            {
                model_name: uploadedHeaders[2],
                parts: [
                    { partBrand: brand, partType: rowMappings[1].partType, partName: uploadedData[1][2] },
                    { partBrand: brands[1].id, partType: rowMappings[4].partType, partName: uploadedData[4][2].slice(brands[1].brand_name.length).trim() },
                ]
            },
            {
                model_name: uploadedHeaders[3],
                description: uploadedData[3][3],
                parts: [
                    { partBrand: brands[0].id, partType: rowMappings[4].partType, partName: uploadedData[4][3].slice(brands[0].brand_name.length).trim() }
                ]
            },
        ]
    };
    expect(buildDataForApi(brand, frameName, rowMappings, uploadedHeaders, uploadedData, brands)).toEqual(expectedData);
});