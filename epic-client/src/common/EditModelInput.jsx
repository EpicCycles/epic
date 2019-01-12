import * as PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {BRAND, CHECKBOX, CURRENCY, NUMBER, PART_TYPE, SUPPLIER, TEXT_AREA} from "../helpers/models";
import FormTextAreaInput from "./FormTextAreaInput";
import FormTextInput from "./FormTextInput";
import PartTypeSelect from "../components/partType/PartTypeSelect";
import BrandSelect from "../components/brand/BrandSelect";
import SupplierSelect from "../components/supplier/SupplierSelect";

class EditModelInput extends Component {
    state = {};
    validateOnChange = (fieldName, fieldValue) => {
        let newState = {};
        if (fieldValue) {
            this.props.onChange(this.props.field.fieldName, fieldValue, this.props.componentKey);
        } else {
            this.props.onChange(this.props.field.fieldName, "", this.props.componentKey);
            if (this.props.field.required) newState.error = this.props.field.error;
        }
        this.setState(newState);
    };
    resetField = fieldName => {
        const originalValue = this.props.persistedModel ? this.props.persistedModel[this.props.field.fieldName] : undefined;
        this.validateOnChange(fieldName, originalValue);
    };

    render() {
        const { field, model, className, componentKey, index, sections, brands, suppliers } = this.props;
        const { error } = this.state;
        let editComponent;
        const fieldName = `${field.fieldName}_${componentKey}${index}`;
        const fieldValue = model && model[field.fieldName];
        const emptyAllowed = !(field.required && fieldValue);

        // TODO add country type field
        switch (field.type) {
            case TEXT_AREA:
                editComponent = <FormTextAreaInput
                    className={className}
                    placeholder={field.header}
                    error={error}
                    fieldName={fieldName}
                    value={fieldValue}
                    onChange={this.validateOnChange}
                    cols={Math.ceil(field.size / 4)}
                    onClick={this.resetField}
                />;
                break;
            case NUMBER:
            case CURRENCY:
                editComponent = <FormTextInput
                    type="number"
                    className={className}
                    placeholder={field.header}
                    error={error}
                    fieldName={fieldName}
                    value={fieldValue}
                    onChange={this.validateOnChange}
                    size={field.size}
                    onClick={this.validateOnChange}
                />;
                break;
            case CHECKBOX:
                editComponent = <input type="checkbox"
                                       name={fieldName}
                                       onChange={() => this.validateOnChange(fieldName, !fieldValue)}
                                       checked={fieldValue}
                />;
                break;
            case PART_TYPE:
                editComponent = <PartTypeSelect
                    sections={sections}
                    fieldName={fieldName}
                    onChange={this.validateOnChange}
                    partTypeSelected={fieldValue}
                    isEmptyAllowed={emptyAllowed}
                    error={error}
                    disabled={false}
                />;
                break;
            case BRAND:
                editComponent = <BrandSelect
                    brands={brands}
                    fieldName={fieldName}
                    onChange={this.validateOnChange}
                    brandSelected={fieldValue}
                    isEmptyAllowed={emptyAllowed}
                    error={error}
                    disabled={false}
                    bikeOnly={field.bikeOnly}
                />;
                break;
            case SUPPLIER:
                editComponent = <SupplierSelect
                    suppliers={suppliers}
                    fieldName={fieldName}
                    onChange={this.validateOnChange}
                    supplierSelected={fieldValue}
                    isEmptyAllowed={emptyAllowed}
                    error={error}
                    disabled={false}
                />;
                break;
            default:
                editComponent = <FormTextInput
                    className={className}
                    placeholder={field.header}
                    error={error}
                    onChange={this.validateOnChange}
                    fieldName={fieldName}
                    value={fieldValue}
                    size={field.size}
                    onClick={this.validateOnChange}
                />;
        }
        return <Fragment>{editComponent}</Fragment>;
    };

}

EditModelInput.propTypes = {
    field: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    persistedModel: PropTypes.object,
    className: PropTypes.string,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    index: PropTypes.number.isRequired,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    onChange: PropTypes.func.isRequired
};
export default EditModelInput;