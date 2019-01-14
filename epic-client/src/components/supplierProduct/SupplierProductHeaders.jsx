import React from "react";
import {supplierProductFields} from "../../helpers/models";
import PartHeaders from "../part/PartHeaders";

const SupplierProductHeaders = () => {
    return <div className="grid-row grid-row--header ">
        <PartHeaders lockFirstColumn={true} />
        {supplierProductFields.map(field => {
            return <div
                className={`grid-item--header`}
                key={`partHead${field.fieldName}`}
            >
                {field.header}
            </div>;
        })}
        <div
            className={`grid-item--header`}
        >
            Errors
        </div>
    </div>;
};
export default SupplierProductHeaders;