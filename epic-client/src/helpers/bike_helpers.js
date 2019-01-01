import {buildPartObject} from "./part_helper";
import {buildBrandNameArray} from "./brand_helper";

export const buildDataForApi = (brand, frameName, rowMappings, uploadedHeaders, uploadedData, brands) => {
    const brandsLower = buildBrandNameArray(brands);

    const frame = {
        brand: brand,
        frame_name: frameName
    };
    // start by building an array of bike objects.
    const bikeNames = uploadedHeaders.slice(1);
    let bikes = bikeNames.map(bikeName => {
        return {model_name:bikeName, parts: []};
    });
    const numberOfBikes = bikes.length;

    rowMappings.forEach(rowMapping => {
        if (!rowMapping.ignore) {
            const dataToUse = uploadedData[rowMapping.rowIndex].slice(1);
            dataToUse.forEach((dataValue, bikeIndex) => {
                if ((bikeIndex < numberOfBikes) && (dataValue.trim().length > 0)) {
                    if (rowMapping.bikeAttribute) {
                        bikes[bikeIndex][rowMapping.bikeAttribute] = dataValue;
                    } else if (rowMapping.partType) {
                        bikes[bikeIndex].parts.push(buildPartObject(
                            rowMapping.partType,
                            dataValue,
                            brandsLower,
                            brand
                        ));
                    }
                }
            });
        }
    });
    frame.bikes = bikes;
    return frame;
};
