export const BRAND = "brand";
export const FRAME_NAME = "frame_name";
export const MODEL_NAME = "model_name";
export const DESCRIPTION = "description";
export const COLOURS = "colours";
export const SELL_PRICE = "sell_price";
export const SIZES = "sizes";

export const BRAND_FIELD = { fieldName: BRAND, header: "Brand", synonyms: [BRAND, 'manufacturer'] };
export const FRAME_NAME_FIELD = { fieldName: FRAME_NAME, header: "Frame Name" };
export const MODEL_NAME_FIELD = { fieldName: MODEL_NAME, header: "Model Name" };
export const COLOURS_FIELD = {
    fieldName: COLOURS,
    header: "Colours",
    synonyms: [COLOURS, "colour", "colors", "color"]
};
export const DESCRIPTION_FIELD = { fieldName: DESCRIPTION, header: "Description", synonyms: [DESCRIPTION, "desc"] };
export const SELL_PRICE_FIELD = {
    fieldName: SELL_PRICE,
    header: "Selling Price",
    synonyms: ["selling price", "srp", "rrp", "sell price", "retail price"]
};
export const SIZES_FIELD = {
    fieldName: SIZES,
    header: "Sizes",
    synonyms: [SIZES, "size", "frame sizes", "frame size"]
};
export const frameFields = [BRAND, FRAME_NAME];
export const bikeFields = [MODEL_NAME_FIELD, DESCRIPTION_FIELD, COLOURS_FIELD, SELL_PRICE_FIELD, SIZES_FIELD];