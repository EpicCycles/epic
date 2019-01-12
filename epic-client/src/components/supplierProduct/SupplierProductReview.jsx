import React, {Fragment} from 'react'
import {doWeHaveObjects, isItAnObject, removeKey, updateObject} from "../../helpers/utils";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import SupplierProductReviewListSelection from "./SupplierProductReviewListSelection";
import PartEditRow from "../part/PartEditRow";
import {partFields, supplierProductFields, updateModelArrayWithChanges} from "../../helpers/models";
import SupplierProductEditRow from "./SupplierProductEditRow";
import SupplierProductHeaders from "./SupplierProductHeaders";
import {findSupplierProducts} from "../../helpers/part_helper";

const initialState = {
    brand: '',
    supplier: '',
    partName: '',
    standard: false,
    stocked: false,
};

class SupplierProductReviewList extends React.Component {
    state = updateObject(initialState);

    componentDidMount() {
        if (!this.props.isLoading) {
            this.getDataForUpload();
        }
    };

    componentDidUpdate() {
        if (!this.props.isLoading) {
            this.getDataForUpload();
        }
    };

    getDataForUpload = () => {
        let brandsRequired = true;
        let frameworkRequired = true;
        if (doWeHaveObjects(this.props.brands)) {
            brandsRequired = false;
        }
        if (doWeHaveObjects(this.props.sections)) {
            frameworkRequired = false;
        }
        if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        } else if (frameworkRequired) {
            this.props.getFramework();
        }
    };

    handleInputChange = (fieldName, input) => {
        let newState = updateObject(this.state);
        newState[fieldName] = input;
        this.setState(newState);
    };
    handleInputClear = (fieldName) => {
        this.setState(removeKey(this.state, fieldName));
    };
    buildSearchCriteria = () => {
        const { brand, supplier, partName, standard, stocked } = this.state;
        return { brand, supplier, partName, standard, stocked };
    };
    hasSelectionCriteria = () => {
        const { brand, supplier, partName } = this.state;
        return !!(brand || supplier || partName);
    };
    hasChanges = () => {
        if (!doWeHaveObjects(this.props.parts)) return false;
        let changedParts = this.props.parts.filter(part => part.changed);
        let changedSupplierProducts = this.props.supplierProducts.filter(supplierProduct => supplierProduct.changed);

        return ((changedParts.length > 0) || (changedSupplierProducts.length > 0));
    };
    listParts = () => {
        this.props.listParts(this.buildSearchCriteria());
    };
    getSupplierProductsForPart = (part) => {
        return findSupplierProducts(part, this.props.supplierProducts);
    };


    showSearch = () => {
        if (this.hasChanges()) {
            if (!window.confirm("Are You Sure?")) return;
        }
        let newState = updateObject(initialState);
        this.setState(newState);
        this.props.clearParts();
    };
    saveChanges = () => {
        let changedParts = this.props.parts.filter(part => isItAnObject(part.changes));
        let changedSupplierProducts = this.props.supplierProducts.filter(supplierProduct => supplierProduct.changed);

        this.props.saveSupplierParts(changedParts, changedSupplierProducts);
    };

    applyPartChanges = (fieldName, fieldValue, componentKey) => {
        const updatedArray = updateModelArrayWithChanges(this.props.parts, partFields, fieldName, fieldValue, componentKey);
        this.props.updateParts(updatedArray);
    };
    applySupplierProductChanges = (fieldName, fieldValue, componentKey) => {
        const updatedArray = updateModelArrayWithChanges(this.props.supplierProducts, supplierProductFields, fieldName, fieldValue, componentKey);
        this.props.updateSupplierProducts(updatedArray);
    };

    render() {
        const { brand, supplier, partName, standard, stocked } = this.state;
        const { isLoading, brands, suppliers, sections, parts } = this.props;
        const hasChanges = this.hasChanges();
        return <Fragment key="productReview">
            {!doWeHaveObjects(parts) ? <SupplierProductReviewListSelection
                    brands={brands}
                    suppliers={suppliers}
                    onChange={this.handleInputChange}
                    brandSelected={brand}
                    supplierSelected={supplier}
                    onClick={this.handleInputClear}
                    partName={partName}
                    changeArchivedSelected={this.changeArchivedSelected}
                    standard={standard}
                    stocked={stocked}
                    listParts={this.listParts}
                    hasSelectionCriteria={this.hasSelectionCriteria()}
                />
                :
                <Fragment>
                    <h2>Review Parts</h2>

                    <div className="row full align_right">
                        <Button
                            key="newSearch"
                            onClick={this.showSearch}
                        >
                            New Search
                        </Button>
                        <Button
                            key="saveChanges"
                            disabled={!hasChanges}
                            onClick={this.saveChanges}
                        >
                            Save Changes
                        </Button>
                    </div>
                    <div
                        key='partReviewGrid'
                        className="grid"
                        style={{
                            height: (window.innerHeight - 100) + "px",
                            width: (window.innerWidth - 50) + "px",
                            overflow: "scroll"
                        }}
                    >
                        <SupplierProductHeaders/>
                        {parts.map((part, partIndex) => {
                            const supplierProducts = this.getSupplierProductsForPart(part);
                            return supplierProducts.map((supplierProduct, supplierProductIndex) => {
                                return <div className="grid-row" key={`partRow${partIndex}`}>
                                    {(supplierProductIndex === 0) && <PartEditRow
                                        part={updateObject(part, part.changes)}
                                        persistedPart={part}
                                        onChange={this.applyPartChanges}
                                        supplierProducts={supplierProducts}
                                        lockFirstColumn
                                        sections={sections}
                                        brands={brands}
                                    />}
                                    <SupplierProductEditRow
                                        supplierProduct={updateObject(supplierProduct, supplierProduct.changes)}
                                        persistedSupplierProduct={supplierProduct}
                                        onChange={this.applySupplierProductChanges}
                                        suppliers={suppliers}
                                    />
                                </div>
                            })
                        })}
                    </div>
                </Fragment>
            }
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
        </Fragment>
    }
}

export default SupplierProductReviewList;