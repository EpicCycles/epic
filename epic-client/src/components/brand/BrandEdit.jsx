import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode, removeObjectWithIndex, updateObject} from "../../helpers/utils";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import SupplierBlob from "../supplier/SupplierBlob";
import {BRAND_NAME_MISSING} from "../../helpers/error";
import {brandFields, updateModel} from "../../helpers/models";

class BrandEdit extends React.Component {
    handleBrandValueChange = (fieldName, input) => {
        const updatedBrand = updateModel(this.props.brand, brandFields, fieldName, input);

        if (this.props.componentKey === NEW_ELEMENT_ID) updatedBrand.dummyKey = NEW_ELEMENT_ID;

        updatedBrand.changed = true;
        this.props.handleBrandChange(this.props.componentKey, updatedBrand);
    };
    removeSupplier = (supplierKey) => {
        let updatedBrand = updateObject(this.props.brand);
        if (updatedBrand.supplier && Array.isArray(updatedBrand.supplier)) {
            const supplierIndex = updatedBrand.supplier.indexOf(supplierKey);
            if (supplierIndex > -1) {
                updatedBrand.supplier = removeObjectWithIndex(updatedBrand.supplier, supplierIndex);
                updatedBrand.supplier_names = removeObjectWithIndex(updatedBrand.supplier_names, supplierIndex);
                updatedBrand.changed = true;
                this.props.handleBrandChange(this.props.componentKey, updatedBrand);
            }
        }
    };

    handleInputClear = (fieldName) => {
        if (window.confirm("Please confirm that you want to delete this Brand")) {
            const updatedBrand = updateObject(this.props.brand);
            updatedBrand.delete = true;
            this.props.handleBrandChange(this.props.componentKey, updatedBrand);
        }
    };
    changeBikeBrand = () => {
        this.handleBrandValueChange("bike_brand", !this.props.brand.bike_brand)
    };
    addAnother = () => {
        const updatedBrand = updateObject(this.props.brand);
        updatedBrand.dummyKey = generateRandomCode();
        this.props.handleBrandChange(NEW_ELEMENT_ID, updatedBrand);
    };

    render() {
        const { brand, componentKey, pickUpBrand } = this.props;
        const suppliers = [];
        if (brand.supplier_names) {
            for (let i = 0; i < brand.supplier_names.length; i++) {
                suppliers.push({
                    id: brand.supplier[i],
                    supplier_name: brand.supplier_names[i]
                });
            }
        }
        return <div
            key={`brand${componentKey}`}
            className="rounded"
            draggable={(pickUpBrand) && (componentKey !== NEW_ELEMENT_ID)}
            onDragStart={event => pickUpBrand(event, componentKey)}
        >
            {componentKey === NEW_ELEMENT_ID &&
            <Icon
                name="add"
                onClick={this.addAnother}
            />
            }
            <FormTextInput
                placeholder="add new"
                fieldName={`brand_name_${componentKey}`}
                value={brand.brand_name}
                onChange={this.handleBrandValueChange}
                onClick={this.handleInputClear}
            />
            <div className="ui toggle checkbox">
                <input type="checkbox"
                       name={`bike_brand_${componentKey}`}
                       onChange={this.changeBikeBrand}
                       checked={brand.bike_brand ? brand.bike_brand : false}
                />
                <label>Bike Brand</label>
            </div>
            Supplier(s): {(suppliers.length > 0) ? suppliers.map(supplier => <SupplierBlob
            key={`supplier${componentKey}${supplier.id}`}
            supplier={supplier}
            componentKey={supplier.id}
            allowRemoval={true}
            removeFunction={this.removeSupplier}
        />) : "Unknown"}
        </div>;
    }
}

export default BrandEdit;