import * as PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {BRAND, CHECKBOX, COUNTRY, CURRENCY, NUMBER, PART_TYPE, SUPPLIER, TEXT_AREA} from "./helpers/fields";
import FormTextAreaInput from "../../../common/FormTextAreaInput";
import FormTextInput from "../../../common/FormTextInput";
import PartTypeSelect from "../../partType/PartTypeSelect";
import BrandSelect from "../../brand/BrandSelect";
import SupplierSelect from "../../supplier/SupplierSelect";
import CountrySelect from "../../address/CountrySelect";

// TODO add types for SELECT_ONE and FITTING
class EditModelInput extends Component {
    validateOnChange = (fieldName, fieldValue) => {
        const { field, componentKey, onChange }  = this.props;
        if (fieldValue || (field.type === CHECKBOX)) {
            onChange(field.fieldName, fieldValue, componentKey);
        } else {
            onChange(field.fieldName, "", componentKey);
        }
    };
    resetField = fieldName => {
        const originalValue = this.props.persistedModel ? this.props.persistedModel[this.props.field.fieldName] : undefined;
        this.validateOnChange(fieldName, originalValue);
    };

    render() {
        const { field, model, className, componentKey, index, sections, brands, suppliers } = this.props;
        let editComponent;
        const fieldName = `${field.fieldName}_${componentKey}${index}`;
        const fieldValue = model && model[field.fieldName];
        const emptyAllowed = !(field.required && fieldValue);
        const error = model.error_detail ? model.error_detail[field.fieldName] : "";

        // TODO country field may not be required - but select one is and also attribute value for use on a quote part.
        switch (field.type) {
            case TEXT_AREA:
                editComponent = <FormTextAreaInput
                    className={className}
                    placeholder={field.header}
                    fieldName={fieldName}
                    value={fieldValue}
                    onChange={this.validateOnChange}
                    cols={Math.ceil(field.size / 4)}
                    onClick={this.resetField}
                    error={error}
                />;
                break;
            case COUNTRY:
                editComponent = <CountrySelect
                    fieldName={fieldName}
                    countrySelected={fieldValue}
                    onChange={this.validateOnChange}
                    isEmptyAllowed={emptyAllowed}
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
                editComponent = <div>
                    <input type="checkbox"
                           name={fieldName}
                           onChange={() => this.validateOnChange(fieldName, !fieldValue)}
                           checked={fieldValue}
                           className={error ? "red" : ""}
                           title={error ? `${field.title} red` : field.title}
                    /></div>;
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
    onChange: PropTypes.func.isRequired,
    fittings: PropTypes.array,
};
export default EditModelInput;