import React from 'react'
import {findObjectWithId} from "../../helpers/utils";
import QuoteEdit from "./QuoteEdit";
import * as PropTypes from "prop-types";
import {findPartsForBike} from "../bike/helpers/bike";
import QuoteSummaryParts from "./QuoteSummaryParts";

const QuoteDetail = props => {
    const { quoteParts, parts, brands, sections, saveQuote, archiveQuote, quote, bikes, bikeParts, frames, customers } = props;

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
        <div>

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
    frames: PropTypes.array.isRequired,
    saveQuote: PropTypes.func.isRequired,
    archiveQuote: PropTypes.func.isRequired,
    // saveQuotePart: PropTypes.func.isRequired,
    // deleteQuotePart: PropTypes.func.isRequired,
    // addQuotePart: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default QuoteDetail;

