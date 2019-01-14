import React from "react";
import ReactModal from 'react-modal';

import * as PropTypes from "prop-types";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import {Icon} from "semantic-ui-react";
import {brandFields, updateModel} from "../../helpers/models";
import EditModelPage from "../../common/EditModelPage";

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

    handleBrandValueChange = (fieldName, input) => {
        const updatedBrand = updateModel(this.props.brand, brandFields, fieldName, input);
        if (fieldName.startsWith('supplier')) {
            updatedBrand.supplier_names = this.buildSupplierNameArray(input, this.props.suppliers);
        }

        if (this.props.componentKey === NEW_ELEMENT_ID) updatedBrand.dummyKey = NEW_ELEMENT_ID;

        this.setState({ brand: updatedBrand });
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
        const { closeBrandModal, suppliers, brandModalOpen, deleteBrand } = this.props;
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
                <EditModelPage
                    model={brand}
                    persistedModel={this.props.brand}
                    modelFields={brandFields}
                    onChange={this.handleBrandValueChange}
                    suppliers={suppliers}
                />
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
    brandModalOpen: PropTypes.bool.isRequired,
    brand: PropTypes.object.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    suppliers: PropTypes.array.isRequired,
    saveBrand: PropTypes.func.isRequired,
    deleteBrand: PropTypes.func.isRequired,
    closeBrandModal: PropTypes.func.isRequired,
};

export default BrandModal;
