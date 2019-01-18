import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import {Icon} from "semantic-ui-react";
import {updateObject} from "../../helpers/utils";

const initialState = {
    brand_names: [],
    supplier_name: "",
    link: "",
    preferred_supplier: true
};

class SupplierEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    checkForChanges = () => {
        const originalSupplier = this.props.supplier;

        if (originalSupplier && (Object.keys(originalSupplier).length > 0)) {
            if ((originalSupplier.supplier_name !== this.state.supplier_name)
                || (originalSupplier.link !== this.state.link)
                || (originalSupplier.preferred_supplier !== this.state.preferred_supplier)) {
                return true;
            }
        } else {
            return (this.state.supplier_name || this.state.link);
        }
    };

    deriveStateFromProps = () => {
        let newState = initialState;
        if (this.props.supplier) {
            newState.id = this.props.supplier.id;
            newState.supplier_name = this.props.supplier.supplier_name;
            newState.brand_names = this.props.supplier.brand_names;
            newState.link = this.props.supplier.link;
            newState.preferred_supplier = this.props.supplier.preferred_supplier;
        }
        return newState;
    };
    validateSupplierData = (supplier_name, link, preferred_supplier) => {
        let isValid = true;
        let nameError = "";

        if (!(supplier_name)) nameError = "Supplier name must be provided";

        if (nameError) isValid = false;
        let newState = this.state;
        newState.nameError = nameError;
        newState.isValid = isValid;
        newState.supplier_name = supplier_name;
        newState.link = link;
        newState.preferred_supplier = preferred_supplier;
        this.setState(newState);
    };
    handleInputChange = (fieldName, input) => {
        let supplier_name = this.state.supplier_name;
        let link = this.state.link;
        let preferred_supplier = this.state.preferred_supplier;

        if (fieldName.startsWith('supplier_name')) supplier_name = input;
        if (fieldName.startsWith('link')) link = input;
        if (fieldName.startsWith('preferred_supplier')) preferred_supplier = input;

        this.validateSupplierData(supplier_name, link, preferred_supplier);
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    saveOrCreateSupplier = () => {
        const updatedSupplier = updateObject(this.props.supplier);
        updatedSupplier.supplier_name = this.state.supplier_name;
        updatedSupplier.link = this.state.link;
        updatedSupplier.preferred_supplier = this.state.preferred_supplier;
        this.props.saveSupplier(updatedSupplier);
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };
    deleteOrRemoveSupplier = () => {
        if (this.state.id) {
            this.props.deleteSupplier(this.state.id);
        }
        this.setState(initialState);
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };

    render() {
        const { supplier_name, link, id, preferred_supplier, brand_names, isValid, nameError } = this.state;
        const { closeModal } = this.props;
        const componentKey = id ? id : NEW_ELEMENT_ID;
        const isChanged = this.checkForChanges();

        return <Fragment>
            {closeModal && <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    name="remove"
                    circular
                    link
                    onClick={closeModal}
                />
            </div>}
            <div style={{ width: "100%", textAlign: "left" }}>
                <h2>Edit Supplier</h2>

                <FormTextInput
                    placeholder="Supplier name"
                    key={`supplier_name_${componentKey}`}
                    fieldName={`supplier_name_${componentKey}`}
                    value={supplier_name}
                    onChange={this.handleInputChange}
                    error={nameError}
                />
                <FormTextInput
                    placeholder="link"
                    fieldName={`link_${componentKey}`}
                    key={`link_${componentKey}`}
                    value={link}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
                <input type="checkbox"
                       name="preferred_supplier"
                       onChange={() => this.handleInputChange("preferred_supplier", !preferred_supplier)}
                       checked={preferred_supplier ? preferred_supplier : false}
                />
                <label>Preferred Supplier</label>
                {brand_names && <div> Brands: {brand_names.join(", ")}</div>}
            </div>
            <div style={{ width: "100%", textAlign: "right" }}>
                {isChanged &&
                <Icon id={`reset-supplier`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Supplier details"
                />
                }
                {(isChanged && isValid) &&
                <Icon id={`accept-supplier`} name="check"
                      onClick={this.saveOrCreateSupplier}
                      title="Confirm Supplier Change"/>
                }
                {(id || isChanged) &&
                <Icon id={`delete-supplier`} name="trash"
                      onClick={this.deleteOrRemoveSupplier}
                      title="Delete Supplier"/>
                }
            </div>
        </Fragment>;
    }
}

export default SupplierEdit;