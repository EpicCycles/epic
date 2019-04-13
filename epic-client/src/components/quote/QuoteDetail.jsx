import React from 'react'
import {findObjectWithId} from "../../helpers/utils";
import QuoteEdit from "./QuoteEdit";
import * as PropTypes from "prop-types";
import {findPartsForBike} from "../bike/helpers/bike";
import QuoteSummaryParts from "./QuoteSummaryParts";
import QuotePartGrid from "./QuotePartGrid";

const QuoteDetail = props => {
    const { quoteParts, parts, supplierProducts, brands, sections, saveQuote, archiveQuote, quote, bikes, bikeParts, frames, customers, deleteQuotePart, saveQuotePart } = props;

    const thisQuoteParts = quoteParts.filter(quotePart => (quotePart.quote === quote.id));
    const bike = findObjectWithId(bikes, quote.bike);
    const thisBikeParts = findPartsForBike(bike, bikeParts, parts);

    return <div className="row">
        <div>
            <QuoteEdit
                quote={quote}
                brands={brands}
                bikes={bikes}
                frames={frames}
                customers={customers}
                saveQuote={saveQuote}
                archiveQuote={archiveQuote}
                key={`editQuote${quote.id}`}
            />
            <div className="grid-container">
                <QuoteSummaryParts
                    lockFirstColumn={true}
                    showPrices={false}
                    quoteParts={thisQuoteParts}
                    brands={brands}
                    sections={sections}
                    parts={parts}
                    bikeParts={thisBikeParts}
                />
            </div>
        </div>
        <div>
            <QuotePartGrid
                quoteParts={thisQuoteParts}
                brands={brands}
                sections={sections}
                parts={parts}
                supplierProducts={supplierProducts}
                bikeParts={thisBikeParts}
                deleteQuotePart={deleteQuotePart}
                saveQuotePart={saveQuotePart}
                quote={quote}
            />
        </div>
    </div>;
};

QuoteDetail.defaultProps = {
    parts: [],
    brands: [],
    sections: [],
    isLoading: false,
};

QuoteDetail.propTypes = {
    quote: PropTypes.object.isRequired,
    quoteParts: PropTypes.array.isRequired,
    bikes: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    brands: PropTypes.array,
    customers: PropTypes.array,
    sections: PropTypes.array,
    parts: PropTypes.array.isRequired,
    supplierProducts: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    saveQuote: PropTypes.func.isRequired,
    archiveQuote: PropTypes.func.isRequired,
    deleteQuotePart: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default QuoteDetail;

