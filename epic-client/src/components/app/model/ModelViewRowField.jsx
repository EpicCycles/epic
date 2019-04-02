import * as PropTypes from "prop-types";
import React, {Component} from "react";
import {buildViewString} from "./helpers/display";


const ModelViewRowField = props => {

        const { field, model, sections, brands, suppliers, customers, bikes, frames } = props;
        let viewData = buildViewString(model, field, sections, brands, suppliers, customers, bikes, frames);
        return <nobr>{Array.isArray(viewData) ? viewData.join() : viewData}</nobr>;
};

ModelViewRowField.propTypes = {
    field: PropTypes.any.isRequired,
    model: PropTypes.any,
    sections: PropTypes.array,
    brands: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    suppliers: PropTypes.array,
    customers: PropTypes.array,
};
export default ModelViewRowField;