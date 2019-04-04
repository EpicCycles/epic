import {recalculatePrices} from "../quote";

const quoteItemAllPricesSingle = {
    part: 24,
    quantity: 1,
    quote_price: 11.50,
};
const quoteItemAllPricesNoQty = {
    part: 24,
    quantity: undefined,
    quote_price: 11.50,
};
const quoteItemNoClubPriceSingle = {
    part: 24,
    quantity: 1,
    quote_price: 11.50,
};
const quoteItemNoEpicPriceSingle = {
    part: 24,
    quantity: 1,
    quote_price: undefined,
};
const quoteItemNoPricesSingle = {
    part: 24,
    quantity: 1,
};
const quoteItemAllPricesMultiple = {
    part: 24,
    quantity: 3,
    quote_price: 11.50,
};

const bike = {
    rrp: 1212.99,
    epic_price: 1011.50,
    club_price: 1000,
};
const bikeNoClubPrice = {
    rrp: 1212.99,
    epic_price: 1011.50,
};
const bikeNoEpicPrice = {
    rrp: 1212.99,
};
test("Recalculate bike quote with no prices", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        bike: 2,
        bike_price: 1234.99,
        colour: "red",
        colour_price: 10,
        frame_size: 54,
    };
    const quote_parts = [quoteItemAllPricesNoQty];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 1011.5,
        }
    );
    expect(recalculatePrices(quote, quote_parts, bikeNoClubPrice)).toEqual(expectedQuote);
});

test("Recalculate non bike quote with prices", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        bike: 2,
        bike_price: 1234.99,
        colour: "red",
        colour_price: 0,
        frame_size: 54,
    };
    const quote_parts = [quoteItemAllPricesMultiple];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 34.50,
        }
    );
    expect(recalculatePrices(quote, quote_parts, undefined)).toEqual(expectedQuote);
});
test("Recalculate bike quote with prices", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        bike: 2,
        bike_price: 1234.99,
        colour: "red",
        colour_price: 0,
        frame_size: 54,
    };
    const quote_parts = [quoteItemAllPricesMultiple];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 1046,
        }
    );
    expect(recalculatePrices(quote, quote_parts, bike)).toEqual(expectedQuote);
});
test("Recalculate bike quote with prices bike missing club price", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        bike: 2,
        bike_price: 1234.99,
        colour: "red",
        colour_price: 0,
        frame_size: 54,
    };
    const quote_parts = [quoteItemAllPricesMultiple];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 1046,
        }
    );
    expect(recalculatePrices(quote, quote_parts, bikeNoClubPrice)).toEqual(expectedQuote);
});
test("Recalculate bike quote with prices bike missing epic price", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        bike: 2,
        bike_price: 1234.99,
        colour: "red",
        colour_price: 0,
        frame_size: 54,
    };
    const quote_parts = [quoteItemAllPricesMultiple];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 1247.49,
        }
    );
    expect(recalculatePrices(quote, quote_parts, bikeNoEpicPrice)).toEqual(expectedQuote);
});
test("Recalculate simple quote quote with no prices", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        colour: "red",
        colour_price: 10,
        frame_size: 54,
    };
    const quote_parts = [quoteItemNoPricesSingle];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 0,
        }
    );
    expect(recalculatePrices(quote, quote_parts)).toEqual(expectedQuote);
});
test("Recalculate simple quote quote with no club prices", () => {
    const quote = {
        quote_status: 1,
        quote_price: 12.99,
        bike: 2,
        bike_price: 1234.99,
        colour: "red",
        colour_price: 10,
        frame_size: 54,
    };
    const quote_parts = [quoteItemNoClubPriceSingle];
    const expectedQuote = Object.assign(
        quote,
        {
            quote_price: 11.50,
        }
    );
    expect(recalculatePrices(quote, quote_parts, {})).toEqual(expectedQuote);
});


