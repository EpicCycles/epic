import {BRAND_MISSING, FRAME_NAME_MISSING, PART_NAME_MISSING, PART_TYPE_MISSING} from "./error";

export const BRAND = "brand";
export const PART_TYPE = "partType";
export const FRAME_NAME = "frame_name";
export const MODEL_NAME = "model_name";
export const PART_NAME = "part_name";
export const DESCRIPTION = "description";
export const COLOURS = "colours";
export const SELL_PRICE = "sell_price";
export const TRADE_IN_PRICE = "trade_in_value";
export const SIZES = "sizes";
export const STANDARD = "standard";
export const STOCKED = "stocked";

export const BRAND_FIELD = {
    fieldName: BRAND,
    header: "Brand",
    synonyms: [BRAND, 'manufacturer'],
    required: true,
    error: BRAND_MISSING
};
export const FRAME_NAME_FIELD = {
    fieldName: FRAME_NAME,
    header: "Frame Name",
    synonyms: [],
    required: true,
    error: FRAME_NAME_MISSING
};
export const MODEL_NAME_FIELD = { fieldName: MODEL_NAME, header: "Model Name", synonyms: [] };
export const COLOURS_FIELD = {
    fieldName: COLOURS,
    header: "Colours",
    synonyms: [COLOURS, "colour", "colors", "color"]
};
export const DESCRIPTION_FIELD = { fieldName: DESCRIPTION, header: "Description", synonyms: [DESCRIPTION, "desc"] };
export const SELL_PRICE_FIELD = {
    fieldName: SELL_PRICE,
    header: "Selling Price",
    synonyms: ["price", "selling price", "srp", "rrp", "sell price", "retail price"]
};
export const SIZES_FIELD = {
    fieldName: SIZES,
    header: "Sizes",
    synonyms: [SIZES, "size", "frame sizes", "frame size"]
};
export const PART_TYPE_FIELD = {
    fieldName: PART_TYPE,
    header: "Part Type",
    required: true,
    error: PART_TYPE_MISSING
};
export const PART_NAME_FIELD = {
    fieldName: PART_NAME,
    header: "Part Name",
    required: true,
    error: PART_NAME_MISSING
};
export const TRADE_IN_FIELD = {
    fieldName: TRADE_IN_PRICE,
    header: "Trade In £",
};
export const STOCKED_FIELD = {
    fieldName: STOCKED,
    header: "Stocked",
};
export const STANDARD_FIELD = {
    fieldName: STANDARD,
    header: "Standard",
};
export const frameFields = [BRAND, FRAME_NAME];
export const bikeFields = [MODEL_NAME_FIELD, DESCRIPTION_FIELD, COLOURS_FIELD, SELL_PRICE_FIELD, SIZES_FIELD];
export const partFields = [
    PART_TYPE_FIELD,
    BRAND_FIELD,
    PART_NAME_FIELD,
    TRADE_IN_FIELD,
    STANDARD_FIELD,
    STOCKED_FIELD
];