import {buildPartObject} from "../../part/helpers/part";
import {buildBrandNameArray, getBrandName} from "../../brand/helpers/brand";
import {findObjectWithId} from "../../../helpers/utils";

export const buildDataForApi = (brand, frameName, rowMappings, uploadedHeaders, uploadedData, brands) => {
    const brandsLower = buildBrandNameArray(brands);

    const frame = {
        brand: brand,
        frame_name: frameName
    };
    // start by building an array of bike objects.
    const bikeNames = uploadedHeaders.slice(1);
    let bikes = bikeNames.map(bikeName => {
        return { model_name: bikeName, parts: [] };
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

export const bikeFullName = (bike, frames, brands) => {
    if (bike.frame_name) return `${bike.frame_name} ${bike.model_name}`;
    const frame = findObjectWithId(frames, bike.frame);
    if (!frame) return `${bike.model_name} (unknown brand and frame)`;
    return `${getBrandName(frame.brand, brands)}: ${frame.frame_name} ${bike.model_name}`
};

export const getBikeName = (bikeId, bikes, frames, brands) => {
        const bike = findObjectWithId(bikes, bikeId);
        if (bike) return bikeFullName(bike, frames, brands);
        return 'Unknown Bike'
};

export const findPartsForBike = (bike, bikeParts, parts) => {
    if (! (bike && bikeParts && parts)) return [];
    return findPartsForBikeId(bike.id, bikeParts, parts);
};
export const findPartsForBikeId = (bikeId, bikeParts, parts) => {
    if (! (bikeId && bikeParts && parts)) return [];
    return bikeParts.filter(bikePart => bikePart.bike === bikeId).map(bikePart => {
        return findObjectWithId(parts, bikePart.part)
    });
};
