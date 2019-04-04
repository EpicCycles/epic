import React from 'react'
import * as PropTypes from "prop-types";
import {doWeHaveObjects, findObjectWithId} from "../../helpers/utils";
import {findPartsForBike} from "../bike/helpers/bike";
import {sectionHasDetail} from "../framework/helpers/display";
import {displayForPartType, quoteFields} from "./helpers/display";
import QuoteSummaryHeaders from "./QuoteSummaryHeaders";
import QuoteSummaryPartType from "./QuoteSummaryPartType";
import ViewModelBlock from "../app/model/ViewModelBlock";

const QuoteSummary = props => {
    const { showPrices, quote, quoteParts, brands, sections, parts, bikes, bikeParts, frames, customers } = props;

    const thisQuoteParts = quoteParts.filter(quotePart => (quotePart.quote === quote.id));
    const bike = findObjectWithId(bikes, quote.bike);
    const thisBikeParts = findPartsForBike(bike, bikeParts, parts);
    const usedSections = sections.filter(section => (sectionHasDetail(section, thisQuoteParts) || sectionHasDetail(section, thisBikeParts)));
    return <div
        className="grid-container"
    >
        <ViewModelBlock
            modelFields={quoteFields}
            model={quote}
            bikes={bikes}
            customers={customers}
            frames={frames}
        />
        {(usedSections.length === 0) && <div data-test="no-summary">No Quote details</div>}
        {(usedSections.length > 0) && <div className='grid'>
            <QuoteSummaryHeaders showPrices={true} data-test='quote-summary-headers'/>
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
        </div>}
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
};

export default QuoteSummary;
