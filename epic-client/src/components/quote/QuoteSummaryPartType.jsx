import React, {Fragment} from 'react';
import * as PropTypes from "prop-types";
import {QUANTITY_FIELD, QUOTE_PRICE_FIELD} from "../app/model/helpers/fields";
import ModelViewRow from "../app/model/ModelViewRow";
import {bikePartOnQuote, priceFields} from "./helpers/display";
import {buildPartString} from "../part/helpers/part";
import {findObjectWithId} from "../../helpers/utils";
import {gridItemClass} from "../app/model/helpers/display";


const QuoteSummaryPartType = props => {
    const { showPrices, partType, bikePart, quotePart, replacementPart, additionalParts, parts, brands } = props;
    return <Fragment>
        {bikePart && <div className="grid-row" key="part-display-grid-row">
            <div
                className={gridItemClass('', 0, true)}
                key={`partType${bikePart.id}`}
                data-test="bike-part-type-cell"
            >{partType.name}</div>
            <div
                className={gridItemClass('', 1, true)}
                key={`part${bikePart.id}`}
                data-test="bike-part-cell"
            >
                {bikePartOnQuote(bikePart, quotePart, replacementPart, brands)}
            </div>
            {showPrices && <ModelViewRow modelFields={priceFields} model={quotePart}/>}
        </div>}
        {additionalParts.map(quotePart => <div className="grid-row" key="part-display-grid-row">
            <div
                className={gridItemClass('', 0, true)}
                key={`partType${quotePart.id}`}
                data-test="additional-part-type-cell"
            >{partType.name}</div>
            <div
                className={gridItemClass('', 1, true)}
                key={`part${quotePart.id}`}
                data-test="additional-part-cell"
            >
                **** {buildPartString(findObjectWithId(parts, quotePart.part), brands)} ****
            </div>
            {showPrices && <ModelViewRow modelFields={priceFields} model={quotePart}/>}
        </div>)}
    </Fragment>
};
QuoteSummaryPartType.defaultProps = {
    additionalParts: [],
    brands: [],
    parts: [],
}
QuoteSummaryPartType.propTypes = {
    showPrices: PropTypes.bool,
    partType: PropTypes.object,
    bikePart: PropTypes.object,
    quotePart: PropTypes.object,
    replacementPart: PropTypes.object,
    additionalParts: PropTypes.array,
    parts: PropTypes.array,
    brands: PropTypes.array,
};

export default QuoteSummaryPartType;
