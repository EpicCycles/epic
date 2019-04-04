import React from 'react';
import * as PropTypes from "prop-types";
import {gridHeaderClass} from "../app/model/helpers/display";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {priceFields} from "./helpers/display";

const QuoteSummaryHeaders = props => {
    const { showPrices } = props;
    return <div className="grid-row grid-row--header " key="part-display-grid-header-row">
        <div
            className={gridHeaderClass(undefined, 0, true)}
            data-test="part-type-header"
        >Part Type
        </div>
        <div
            className={gridHeaderClass(undefined, 1, true)}
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
};

export default QuoteSummaryHeaders;
