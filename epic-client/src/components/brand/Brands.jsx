import React, {Fragment} from "react";
import ReactModal from 'react-modal';

import {findIndexOfObjectWithKey, findObjectWithKey} from "../../helpers/utils";
import {Button, Dimmer, Icon, Loader} from "semantic-ui-react";
import {Prompt} from "react-router";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import BrandEdit from "./BrandEdit";
import SupplierEdit from "../supplier/SupplierEdit";
import SupplierBlob from "../supplier/SupplierBlob";

class Brands extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentWillMount() {
        if (!(this.props.brands && this.props.brands.length > 0)) {
            this.props.getBrandsAndSuppliers();
        }
    };


    handleOpenModal(supplierId) {
        if (supplierId) {
            this.setState({ showModal: true, supplierId });
        } else {
            this.setState({ showModal: true });
        }
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

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
        const brands = this.props.brands;
        const suppliers = this.props.suppliers;
        event.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        const brandKey = event.dataTransfer.getData("text");
        const brandsWithUpdates = brands.slice();
        const brandToUpdateIndex = findIndexOfObjectWithKey(brands, brandKey);
        const supplierIndex = findIndexOfObjectWithKey(suppliers, supplierId);
        if ((supplierIndex > -1) && (brandToUpdateIndex > -1)) {
            if (brandsWithUpdates[brandToUpdateIndex].supplier) {
                brandsWithUpdates[brandToUpdateIndex].supplier.push(suppliers[supplierIndex].id);
                brandsWithUpdates[brandToUpdateIndex].supplier_names.push(suppliers[supplierIndex].supplier_name);
            } else {
                brandsWithUpdates[brandToUpdateIndex].supplier = [suppliers[supplierIndex].id];
                brandsWithUpdates[brandToUpdateIndex].supplier_names = [suppliers[supplierIndex].supplier_name];
            }
            brandsWithUpdates[brandToUpdateIndex].changed = true;
            this.props.updateBrands(brandsWithUpdates);
        }
    };

    render() {
        const {
            brands,
            suppliers,
            isLoading,
            saveSupplier,
            deleteSupplier
        } = this.props;
        const { showModal, supplierId } = this.state;
        const supplierToEdit = supplierId ? findObjectWithKey(suppliers, supplierId) : {};
        const brandsToUse = brands ? brands.filter(brand => !(brand.delete || (brand.dummyKey === NEW_ELEMENT_ID))) : [];
        const suppliersToUse = suppliers ? suppliers.filter(supplier => !(supplier.delete || (supplier.dummyKey === NEW_ELEMENT_ID))) : [];
        const brandsWithChanges = brands ? brands.filter(brand => (brand.delete || brand.changed)) : [];
        const newbrands = brands ? brands.filter(brand => (brand.dummyKey === NEW_ELEMENT_ID)) : [];
        let newbrandForDisplay = (newbrands.length > 0) ? newbrands[0] : {};
        const changesExist = brandsWithChanges.length > 0;
        return <Fragment>
            <Prompt
                when={changesExist}
                message="You have made changes to brands. Cancel and Save if you do not want to lose them."
            />
            <section key={`brandsAndSuppliers`} className="row">
                <div key={`brands`}>
                    <Button
                        key="saveBrandsChanges"
                        onClick={this.saveChanges}
                        disabled={isLoading || !changesExist}
                    >
                        Save
                    </Button>
                    {brandsToUse.map(brand => {
                        const componentKey = brand.id ? brand.id : brand.dummyKey;
                        return <BrandEdit
                            key={`brandEdit${componentKey}`}
                            brand={brand}
                            componentKey={componentKey}
                            handleBrandChange={this.handleBrandChange}
                            pickUpBrand={this.pickUpBrand}
                        />;
                    })}
                    <BrandEdit
                        key={`brandEdit${NEW_ELEMENT_ID}`}
                        brand={newbrandForDisplay}
                        componentKey={NEW_ELEMENT_ID}
                        handleBrandChange={this.handleBrandChange}
                        pickUpBrand={this.pickUpBrand}
                    />
                </div>
                <div key={`suppliers`}>
                    <div>
                        <button onClick={this.handleOpenModal}>Add Supplier</button>
                        <ReactModal
                            isOpen={showModal}
                            contentLabel="Edit Suppler"
                            className="Modal SupplierModal"
                        >
                            <SupplierEdit
                                supplier={supplierToEdit ? supplierToEdit : {}}
                                componentKey={supplierId ? supplierId : NEW_ELEMENT_ID}
                                saveSupplier={saveSupplier}
                                deleteSupplier={deleteSupplier}
                                closeModal={this.handleCloseModal}
                            />
                        </ReactModal>
                    </div>
                    {suppliersToUse && suppliersToUse.map(supplier => {
                        const componentKey = supplier.id ? supplier.id : supplier.dummyKey;
                        return <div
                            key={`droppablediv${componentKey}`}
                            onDragOver={event => this.allowDrop(event)}
                            onDrop={event => this.assignToSupplier(event, supplier.id)}>
                            <SupplierBlob
                                supplier={supplier}
                                componentKey={componentKey}
                                showBrands={true}
                                showWebsite={true}
                                allowEdit={true}
                                editFunction={this.handleOpenModal}
                            />
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
