import React, {Fragment} from 'react'
import * as PropTypes from "prop-types";
import {doWeHaveObjects, findObjectWithId} from "../../helpers/utils";
import {findPartsForBike} from "../bike/helpers/bike";
import {sectionHasDetail} from "../framework/helpers/display";
import {displayForPartType} from "./helpers/display";
import QuoteSummaryHeaders from "./QuoteSummaryHeaders";
import QuoteSummaryPartType from "./QuoteSummaryPartType";

const QuoteSummary = props => {
    const { showPrices, quote, quoteParts, brands, sections, parts, bikes, bikeParts } = props;

    const thisQuoteParts = quoteParts.filter(quotePart => (quotePart.quote === quote.id));
    const bike = findObjectWithId(bikes, quote.bike);
    const thisBikeParts = findPartsForBike(bike, bikeParts, parts);
    const usedSections = sections.filter(section => (sectionHasDetail(section, thisQuoteParts) || sectionHasDetail(section, thisBikeParts)));

    if (usedSections.length === 0) return <div data-test="no-summary">No Quote details</div>
    return <div
        className="grid-container"
    >
        <div className='grid'>
            <QuoteSummaryHeaders showPrices={true} data-test='quote-summary-headers' />
            {usedSections.map(section => section.partTypes.map(partType => {
                const displayData = displayForPartType(partType.id, thisQuoteParts, thisBikeParts, parts);
                if (displayData.bikePart || displayData.quotePart || doWeHaveObjects(displayData.additionalParts)) {
                    return <QuoteSummaryPartType
                        showPrices={true}
                        partType={partType}
                        bikePart={displayData.bikePart}
                        quotePart={displayData.quotePart}
                        replacementPart={displayData.replacementPart}
                        additionalParts={displayData.additionalParts}
                        parts={parts}
                        brands={brands}
                    />
                } else {
                    return null;
                }
            }))}
        </div>

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
};

export default QuoteSummary;
