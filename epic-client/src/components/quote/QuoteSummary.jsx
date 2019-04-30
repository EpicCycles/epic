import React from 'react'
import * as PropTypes from "prop-types";
import {findObjectWithId} from "../../helpers/utils";
import {findPartsForBike} from "../bike/helpers/bike";
import { quoteFields} from "./helpers/display";
import ViewModelBlock from "../app/model/ViewModelBlock";
import QuoteSummaryParts from "./QuoteSummaryParts";

const QuoteSummary = props => {
    const { showPrices, quote, quoteParts, brands, sections, parts, bikes, bikeParts, frames, customers, users } = props;

    const thisQuoteParts = quoteParts.filter(quotePart => (quotePart.quote === quote.id));
    const bike = findObjectWithId(bikes, quote.bike);
    const thisBikeParts = findPartsForBike(bike, bikeParts, parts);
    return <div
        className="grid-container"
    >
        <ViewModelBlock
            modelFields={quoteFields}
            model={quote}
            bikes={bikes}
            customers={customers}
            frames={frames}
            users={users}
        />
        <QuoteSummaryParts
            lockFirstColumn={true}
            showPrices={showPrices}
            quoteParts={thisQuoteParts}
            brands={brands}
            sections={sections}
            parts={parts}
            bikeParts={thisBikeParts}
        />
    </div>
};

QuoteSummary.propTypes = {
    showPrices: PropTypes.bool,
    quote: PropTypes.object.isRequired,
    quoteParts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    bikes: PropTypes.array.isRequired,
    customers: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
};

export default QuoteSummary;
