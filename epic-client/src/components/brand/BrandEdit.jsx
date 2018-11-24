import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import {Icon} from "semantic-ui-react";
import {colourStyles, NEW_ELEMENT_ID} from "../../helpers/constants";

class BrandEdit extends React.Component {
    handleBrandValueChange = (fieldName, input) => {
        const updatedBrand = Object.assign({}, this.props.brand);
        if (fieldName.startsWith('brand_name')) updatedBrand.brand_name = input;
        if (!updatedBrand.brand_name) {
            updatedBrand.error = true;
            updatedBrand.error_detail = "A name is required for the brand";
        } else {
            updatedBrand.error = false;
            updatedBrand.error_detail = "";
        }

        if (this.props.componentKey === NEW_ELEMENT_ID) updatedBrand.dummyKey = NEW_ELEMENT_ID;

        updatedBrand.changed = true;
        this.props.handleBrandChange(this.props.componentKey, updatedBrand);
    };

    handleInputClear = (fieldName) => {
        if (window.confirm("Please confirm that you want to delete this Brand")) {
            const updatedBrand = Object.assign({}, this.props.brand);
            updatedBrand.delete = true;
            this.props.handleBrandChange(this.props.componentKey, updatedBrand);
        }
    };
    addAnother = () => {
        const updatedBrand = Object.assign({}, this.props.brand);
        updatedBrand.dummyKey = generateRandomCode();
        this.props.handleBrandChange(NEW_ELEMENT_ID, updatedBrand);
    };

    render() {
        const { brand, componentKey, pickUpBrand } = this.props;
        const coloursLength = colourStyles.length;

        const colourChoice = brand.supplier ? ((brand.supplier) % coloursLength) : -1;

        const colour = (colourChoice < 0) ? 'col-epic' : colourStyles[colourChoice].colour;
        const background = (colourChoice < 0) ? 'bg-white' : colourStyles[colourChoice].background;
        const border = (colourChoice < 0) ? 'border-epic' : colourStyles[colourChoice].border;

        return <div
            key={`brand${brand.id}`}
            className={`rounded ${colour} ${background} ${border}`}
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
           {componentKey !== NEW_ELEMENT_ID && `Supplier: ${(brand.supplier) ? brand.supplier : "unknown"}`}
        </div>;
    }
}

export default BrandEdit;