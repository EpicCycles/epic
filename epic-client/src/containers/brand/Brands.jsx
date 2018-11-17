import React, {Fragment} from "react";

import {findIndexOfObjectWithKey} from "../../helpers/utils";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import {Prompt} from "react-router";
import {colourStyles, NEW_ELEMENT_ID} from "../../helpers/constants";

class Brands extends React.Component {
    componentWillMount() {
        if (!(this.props.brands && this.props.brands.length > 0)) {
            this.props.getBrandsAndSuppliers();
        }
    };

    handleBrandChange = (brandKey, updatedbrand) => {
        const brandsWithUpdates = this.props.brands.slice();
        const brandToUpdateIndex = findIndexOfObjectWithKey(brandsWithUpdates, brandKey);
        if (brandToUpdateIndex > -1) {
            brandsWithUpdates[brandToUpdateIndex] = updatedbrand;
        } else {
            brandsWithUpdates.push(updatedbrand);
        }
        this.props.updateBrands(brandsWithUpdates);
    };

    saveChanges = () => {
        this.props.saveBrands(this.props.brands);
    };

    allowDrop = (event) => {
        console.log("dragOver");

        event.preventDefault();
        // Set the dropEffect to move
        event.dataTransfer.dropEffect = "move"
    };

    pickUpBrand = (event, brandKey) => {
        console.log("dragStart", brandKey);

        // Add the target element's id to the data transfer object
        event.dataTransfer.setData("text/plain", brandKey);
        event.dropEffect = "move";
    };

    assignToSupplier = (event, supplierId) => {
        console.log("drop");

        event.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        const brandKey = event.dataTransfer.getData("text");
        const brandsWithUpdates = this.props.brands.slice();
        const brandToUpdateIndex = findIndexOfObjectWithKey(brandsWithUpdates, brandKey);
        if (brandToUpdateIndex > -1) {
            brandsWithUpdates[brandToUpdateIndex].supplier = supplierId;
        }
        this.props.updateBrands(brandsWithUpdates);
    };

    render() {
        const {
            brands,
            suppliers,
            isLoading
        } = this.props;
        const brandsToUse = brands ? brands.filter(brand => !(brand.delete || (brand.dummyKey === NEW_ELEMENT_ID))) : [];
        const brandsWithChanges = brands ? brands.filter(brand => (brand.delete || brand.changed)) : [];
        const newbrands = brands ? brands.filter(brand => (brand.dummyKey === NEW_ELEMENT_ID)) : [];
        let newbrandForDisplay = (newbrands.length > 0) ? newbrands[0] : {};
        const changesExist = brandsWithChanges.length > 0;
        const coloursLength = colourStyles.length;
        //onChange={event => onChange(event.target.name, event.target.value)}
        return <Fragment>
            <Prompt
                when={changesExist}
                message="You have made changes to brands. Cancel and Save if you do not want to lose them."
            />
            <section key={`brandsAndSuppliers`} className="row">
                <div key={`brands`}>
                    {brandsToUse.map(brand => {
                        const colourChoice = brand.supplier ? ((brand.supplier + coloursLength) % coloursLength) : -1;

                        const colour = (colourChoice < 0) ? 'clearRed' : colourStyles[colourChoice].colour;
                        const background = (colourChoice < 0) ? 'bg-white' : colourStyles[colourChoice].background;
                        const border = (colourChoice < 0) ? 'border--red' : colourStyles[colourChoice].border;

                        return <div
                            key={`brand${brand.id}`}
                            className={`rounded ${colour} ${background} ${border}`}
                            draggable={true}
                            onDragStart={event => this.pickUpBrand(event, brand.id)}
                        >
                            {brand.brand_name} Supplier: {(brand.supplier) ? brand.supplier : "unknown"}
                        </div>;
                    })}
                </div>
                <div key={`suppliers`}>
                    {suppliers && suppliers.map(supplier => {
                        const colourChoice = (supplier.id + coloursLength) % coloursLength;

                        const colour = colourStyles[colourChoice].colour;
                        const background = colourStyles[colourChoice].background;
                        const border = colourStyles[colourChoice].border;
                        return <div
                            key={`supplier${supplier.id}`}
                            className={`rounded ${colour} ${background} ${border}`}
                            onDragOver={event => this.allowDrop(event)}
                            onDrop={event => this.assignToSupplier(event, supplier.id)}
                        >
                            {supplier.supplier_name} Brands: {brands.filter(brand => {
                            return (brand.supplier === supplier.id)
                        }).length}
                        </div>
                    })}
                </div>
            </section>
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }

        </Fragment>;
    }
}

export default Brands;
