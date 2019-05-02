import React, {Fragment} from "react";
import {supplierProductFields} from "../app/model/helpers/fields";
import * as PropTypes from "prop-types";
import AdditionalHeader from "../app/model/AdditionalHeader";
import ModelTableHeaders from "../app/model/ModelTableHeaders";

const SupplierProductFieldHeaders = (props) => {
    return <Fragment>
        <ModelTableHeaders modelFields={supplierProductFields} className={props.className} lockFirstColumn={props.lockFirstColumn}/>
        {props.showErrors && <AdditionalHeader headerText={'Errors'} className={props.className}/>}
    </Fragment>;
};
SupplierProductFieldHeaders.defaultProps = {
    lockFirstColumn: false,
    showErrors: false,
    className: "",
};
SupplierProductFieldHeaders.propTypes = {
    lockFirstColumn: PropTypes.bool,
    showErrors: PropTypes.bool,
    className: PropTypes.string,
};
export default SupplierProductFieldHeaders;