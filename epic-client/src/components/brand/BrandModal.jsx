import React from "react";
import ReactModal from 'react-modal';

import * as PropTypes from "prop-types";
import FormTextInput from "../../common/FormTextInput";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import {Icon} from "semantic-ui-react";
import SupplierSelect from "../supplier/SupplierSelect";
import {BRAND_NAME_MISSING} from "../../helpers/error";

class BrandModal extends React.Component {
    state = {};

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = this.deriveStateFromProps(props);
    };
    onAfterOpen = () => {
        this.setState(this.deriveStateFromProps(this.props));
    };
    deriveStateFromProps = (props) => {
        return {
            brand: props.brand || {},
            mode: (props.brand && props.brand.id) ? "Edit" : "New",
        }
    };
    changeBikeBrand = () => {
        this.handleBrandValueChange("bike_brand", !this.state.brand.bike_brand)
    };

    handleBrandValueChange = (fieldName, input) => {
        const updatedBrand = Object.assign({}, this.state.brand);
        if (fieldName.startsWith('brand_name')) updatedBrand.brand_name = input;
        if (fieldName.startsWith('link')) updatedBrand.link = input;
        if (fieldName.startsWith('bike_brand')) updatedBrand.bike_brand = input;
        if (fieldName.startsWith('supplier')) {
            updatedBrand.supplier = input;
            updatedBrand.supplier_names = this.buildSupplierNameArray(input, this.props.suppliers);
        }
        if (!updatedBrand.brand_name) {
            updatedBrand.error = true;
            updatedBrand.error_detail = BRAND_NAME_MISSING;
        } else {
            updatedBrand.error = false;
            updatedBrand.error_detail = "";
        }

        if (this.props.componentKey === NEW_ELEMENT_ID) updatedBrand.dummyKey = NEW_ELEMENT_ID;

        updatedBrand.changed = true;
        this.setState({ brand: updatedBrand });
    };
    handleInputClear = (fieldName) => {
        if (fieldName.startsWith('brand_name')) {
            if (window.confirm("Please confirm that you want to delete this Brand")) {
                const updatedBrand = Object.assign({}, this.props.brand);
                updatedBrand.delete = true;
                this.props.handleBrandChange(this.props.componentKey, updatedBrand);
            }
        } else {
            this.handleBrandValueChange(fieldName, "");
        }
    };

    buildSupplierNameArray = (selectedSuppliers, suppliers) => {
        let supplier_names = [];
        suppliers.forEach(supplier => {
            if (selectedSuppliers.includes(supplier.id)) {
                supplier_names.push(supplier.supplier_name);
            }
        });
        return supplier_names;
    };
    onClickReset = () => {
        this.setState(this.deriveStateFromProps(this.props));
    };

    saveOrCreateBrand = () => {
        this.props.saveBrand(this.state.brand);
        this.props.closeBrandModal();
    };
    deleteOrRemoveBrand = () => {
        if (this.state.componentKey) {
            this.props.deleteBrand(this.state.brand);
        }
        this.props.closeBrandModal();
    };

    render() {
        const { brand, mode } = this.state;
        const { componentKey, closeBrandModal, suppliers, brandModalOpen, deleteBrand } = this.props;
        return <ReactModal
            isOpen={brandModalOpen}
            contentLabel={`${mode} Brand`}
            className="Modal BrandModal"
            onAfterOpen={this.onAfterOpen}
        >
            <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    name="remove"
                    circular
                    link
                    onClick={closeBrandModal}
                />
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
                <h2>{mode} Brand</h2>
                {brand.error && <div className="red">{brand.error_detail}</div>}
                <FormTextInput
                    placeholder="add new"
                    fieldName={`brand_name_${componentKey}`}
                    value={brand.brand_name}
                    onChange={this.handleBrandValueChange}
                    onClick={this.handleInputClear}
                />
                <FormTextInput
                    placeholder="link"
                    fieldName={`link_${componentKey}`}
                    key={`link_${componentKey}`}
                    value={brand.link}
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
                {suppliers && <div className="row">
                    <label>Supplier(s):</label>
                    <SupplierSelect
                        fieldName={`supplier_${componentKey}`}
                        onChange={this.handleBrandValueChange}
                        supplierSelected={brand.supplier}
                        suppliers={suppliers}
                        isEmptyAllowed={true}
                        isMultiple={true}
                        multipleSize={10}
                    />
                </div>}
            </div>
            <div style={{ width: "100%", textAlign: "right" }}>
                {brand.changed &&
                <Icon id={`reset-brand`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Brand details"
                />
                }
                {(brand.changed && (!brand.error)) &&
                <Icon id={`accept-brand`} name="check"
                      onClick={this.saveOrCreateBrand}
                      title="Confirm Brand Change"/>
                }
                {(deleteBrand && (brand.id || brand.changed)) &&
                <Icon id={`delete-brand`} name="trash"
                      onClick={this.deleteOrRemoveBrand}
                      title="Delete Brand"/>
                }
            </div>
        </ReactModal>;
    }
}

BrandModal.propTypes = {
    brandModalOpen: PropTypes.any,
    brand: PropTypes.any,
    componentKey: PropTypes.any,
    suppliers: PropTypes.any,
    saveBrand: PropTypes.any,
    deleteBrand: PropTypes.any,
    closeBrandModal: PropTypes.func
};

export default BrandModal;
