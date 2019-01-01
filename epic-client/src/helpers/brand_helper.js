export const buildBrandNameArray = brands => {
    const brandsLower = brands.map(brand => {
        return {
            id: brand.id,
            brand_name: brand.brand_name.toLowerCase()
        };
    });
    brandsLower.sort((a, b) => b.brand_name.length - a.brand_name.length);
    return brandsLower;
};

export const getBrandName = (brandId, brands) => {
    let brandName = "Unknown Brand";

    brands.some(brand => {
        if (brand.id === brandId) {
            brandName = brand.brand_name;
            return true;
        }
        return false;
    });
    return brandName;
};