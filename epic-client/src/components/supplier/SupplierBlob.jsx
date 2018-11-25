import React from "react";
import {buildColourAttributesForId} from "../../helpers/utils";
import {Icon} from "semantic-ui-react";

class SupplierBlob extends React.Component {
    render() {
        const {
            supplier,
            componentKey,
            showBrands,
            showWebsite,
            allowRemoval,
            removeFunction,
            allowEdit,
            editFunction,
        } = this.props;
        const colourAttributes = buildColourAttributesForId(componentKey);
        const dest = allowEdit ? "E" : "";
        return <div
            key={`supplierBlob${dest}${componentKey}`}
            className={`rounded-auto ${colourAttributes.colour} ${colourAttributes.background} ${colourAttributes.border}`}
        >
            <nobr>
                {supplier.supplier_name}
                {allowEdit && <Icon
                    key={`supplierBlobEdit${dest}${componentKey}`}
                    name="edit"
                    onClick={() => editFunction(componentKey)}
                />}
                {allowRemoval && <Icon
                    key={`supplierBlobDelete${dest}${componentKey}`}
                    name="delete"
                    onClick={() => removeFunction(componentKey)}
                />}
            </nobr>
            {showBrands &&
            <div key={`supplierBlobBrands${dest}${componentKey}`}> Brands: {supplier.brand_names.join(", ")}</div>}
            {(showWebsite && supplier.website) &&
            <a key={`supplierBlobLink${dest}${componentKey}`} href={supplier.website}>Website</a>}
        </div>;
    }
}

export default SupplierBlob;