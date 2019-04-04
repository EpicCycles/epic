import React from 'react';
import * as PropTypes from "prop-types";
import {gridHeaderClass} from "../app/model/helpers/display";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {priceFields} from "./helpers/display";

const QuoteSummaryHeaders = props => {
    const { showPrices, lockFirstColumn } = props;
    return <div className="grid-row grid-row--header " key="part-display-grid-header-row">
        <div
            className={gridHeaderClass(undefined, 0, lockFirstColumn)}
            data-test="part-type-header"
        >Part Type
        </div>
        <div
            className={gridHeaderClass(undefined, 1, lockFirstColumn)}
            data-test="part-header"
        >Part
        </div>
        {showPrices && <ModelTableHeaders
            modelFields={priceFields}
        />}
    </div>
};

QuoteSummaryHeaders.propTypes = {
    showPrices: PropTypes.bool,
    lockFirstColumn: PropTypes.bool,
};

export default QuoteSummaryHeaders;
