export const buildDataForApi = (brand, frameName, rowMappings, uploadedHeaders, uploadedData, brands) => {
    const brandsLower = brands.map(brand => {
        return {
            id: brand.id,
            brand_name: brand.brand_name.toLowerCase()
        };
    });
    brandsLower.sort((a,b) => b.brand_name.length - a.brand_name.length);
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

export const buildPartObject = (partType, partNameWithBrand, brandsLower, bikeBrand) => {
    let partBrandFound = brandsLower.find(brand => {
        return partNameWithBrand.toLowerCase().startsWith(brand.brand_name)
    });
    const partBrand = partBrandFound ? partBrandFound.id : bikeBrand;
    const partName = partBrandFound ? partNameWithBrand.slice(partBrandFound.brand_name.length).trim() : partNameWithBrand;

    return {partType, partName, partBrand};
};