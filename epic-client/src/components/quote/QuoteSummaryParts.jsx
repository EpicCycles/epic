import React, {Fragment} from 'react'
import * as PropTypes from "prop-types";
import {doWeHaveObjects} from "../../helpers/utils";
import {sectionHasDetail} from "../framework/helpers/display";
import {displayForPartType} from "./helpers/display";
import QuoteSummaryHeaders from "./QuoteSummaryHeaders";
import QuoteSummaryPartType from "./QuoteSummaryPartType";

const QuoteSummaryParts = props => {
    const { showPrices, quoteParts, brands, sections, parts, bikeParts, lockFirstColumn } = props;
    const usedSections = sections.filter(section => (sectionHasDetail(section, quoteParts) || sectionHasDetail(section, bikeParts)));
    return <Fragment>
        {(usedSections.length === 0) && <div data-test="no-summary">No Quote details</div>}
        {(usedSections.length > 0) && <div className='grid'>
            <QuoteSummaryHeaders
                showPrices={showPrices}
                lockFirstColumn={lockFirstColumn}
                data-test='quote-summary-headers'
            />
            {usedSections.map(section => section.partTypes.map(partType => {
                const displayData = displayForPartType(partType.id, quoteParts, bikeParts, parts);
                if (displayData.bikePart || displayData.quotePart || doWeHaveObjects(displayData.additionalParts)) {
                    return <QuoteSummaryPartType
                        key={`quote-part-type-${partType.id}`}
                        lockFirstColumn={lockFirstColumn}
                        showPrices={showPrices}
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
    </Fragment>
};

QuoteSummaryParts.propTypes = {
    showPrices: PropTypes.bool,
    lockFirstColumn: PropTypes.bool,
    quoteParts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
};

export default QuoteSummaryParts;
