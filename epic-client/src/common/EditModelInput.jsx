import * as PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {BRAND, CHECKBOX, CURRENCY, NUMBER, PART_TYPE, SUPPLIER, TEXT_AREA} from "../helpers/models";
import FormTextAreaInput from "./FormTextAreaInput";
import FormTextInput from "./FormTextInput";
import PartTypeSelect from "../components/partType/PartTypeSelect";
import BrandSelect from "../components/brand/BrandSelect";
import SupplierSelect from "../components/supplier/SupplierSelect";

class EditModelField extends Component {
    state = {};
    validateOnChange = (fieldName, fieldValue) => {
        if (fieldValue) {
            this.props.onChange(this.props.field.fieldName, fieldValue, this.props.componentKey);
        } else {
            this.props.onChange(this.props.field.fieldName, "", this.props.componentKey);
            if (this.props.field.required) {
                this.setState({ error: this.props.field.error })
            }
        }
    };
    resetField = fieldName => {
        this.props.onChange(fieldName, this.props.persistedModel[this.props.field.fieldName]);
    };

    render() {
        const { field, model, className, componentKey, index, sections, brands, suppliers } = this.props;
        const { error } = this.state;
        let editComponent;
        const fieldName = `${field.fieldName}_${componentKey}${index}`;
        const fieldValue = model[field.fieldName];
        const emptyAllowed = !(field.required && fieldValue);
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

EditModelField.propTypes = {
    field: PropTypes.any,
    model: PropTypes.any,
    persistedModel: PropTypes.any,
    className: PropTypes.any,
    componentKey: PropTypes.any,
    index: PropTypes.any,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    onChange: PropTypes.func
};
export default EditModelField;