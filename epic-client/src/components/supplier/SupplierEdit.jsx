import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import {colourStyles, NEW_ELEMENT_ID} from "../../helpers/constants";

class SupplierEdit extends React.Component {
    handleSupplierValueChange = (fieldName, input) => {
        const updatedSupplier = Object.assign({}, this.props.supplier);
        if (fieldName.startsWith('supplier_name')) updatedSupplier.supplier_name = input;
        if (!updatedSupplier.supplier_name) {
            updatedSupplier.error = true;
            updatedSupplier.error_detail = "A name is required for the supplier";
        } else {
            updatedSupplier.error = false;
            updatedSupplier.error_detail = "";
        }

        if (this.props.componentKey === NEW_ELEMENT_ID) updatedSupplier.dummyKey = NEW_ELEMENT_ID;

        updatedSupplier.changed = true;
        this.props.handleSupplierChange(this.props.componentKey, updatedSupplier);
    };

    handleInputClear = (fieldName) => {
        if (this.props.brands.length > 0) {
            window.alert("The supplier cannot be deleted while brands are still related to it")
        } else if (window.confirm("Please confirm that you want to delete this Supplier")) {
            const updatedSupplier = Object.assign({}, this.props.supplier);
            updatedSupplier.delete = true;
            this.props.handleSupplierChange(this.props.componentKey, updatedSupplier);
        }
    };
    addSupplier = () => {
        const updatedSupplier = Object.assign({}, this.props.supplier);
        updatedSupplier.dummyKey = generateRandomCode();
        this.props.handleSupplierChange(NEW_ELEMENT_ID, updatedSupplier);
    };

    render() {
        const { supplier, componentKey, assignToSupplier, allowDrop, brands } = this.props;
        const coloursLength = colourStyles.length;

        const colourChoice = (supplier.id) % coloursLength;

        const colour = colourStyles[colourChoice].colour;
        const background = colourStyles[colourChoice].background;
        const border = colourStyles[colourChoice].border;
        const brandNames = brands.map(brand => brand.brand_name);
        return <div
            key={`supplier${componentKey}`}
            className={`rounded ${colour} ${background} ${border}`}
            onDragOver={event => allowDrop(event)}
            onDrop={event => assignToSupplier(event, supplier.id)}
        >
            <FormTextInput
                placeholder="add new"
                fieldName={`supplier_name_${componentKey}`}
                value={supplier.supplier_name}
                onChange={this.handleSupplierValueChange}
                onClick={this.handleInputClear}
            />
            <div> Brands: {brandNames.join(", ")}</div>
        </div>;
    }
}

export default SupplierEdit;