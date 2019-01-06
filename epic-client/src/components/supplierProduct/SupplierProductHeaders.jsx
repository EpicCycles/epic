import React from "react";
import {partFields, supplierProductFields} from "../../helpers/models";

const SupplierProductHeaders = () => {
    return <div className="grid-row grid-row--header ">
        {partFields.map((field, index) => {
            return <div
                className={`grid-item--header ${(index === 0) && "grid-header--fixed-left"}`}
                key={`partHead${field.fieldName}`}
            >
                {field.header}
            </div>;
        })}
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