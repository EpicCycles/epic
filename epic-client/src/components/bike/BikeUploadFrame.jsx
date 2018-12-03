import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import React from "react";
import BrandModal from "../brand/BrandModal";
import {findIndexOfObjectWithKey} from "../../helpers/utils";
class BikeUploadFrame extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
            this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }
    saveBrand = (brand) => {
        const brandsWithUpdates = this.props.brands.slice();
        brandsWithUpdates.push(brand);
        this.props.saveBrands(brandsWithUpdates);
    }
    render() {
        const {showModal} = this.state;
        const {brands, onChange, brandSelected, isEmptyAllowed, frameName} = this.props;
        return <div key='bikeUpload' className="grid">
            <div className="grid-row">
                <div className="grid-item--borderless field-label">
                    Bike Brand
                </div>
                <div className="grid-item--borderless">
                    <BrandSelect
                        brands={brands}
                        fieldName="brand"
                        onChange={onChange}
                        brandSelected={brandSelected}
                        isEmptyAllowed={isEmptyAllowed}
                    />
                    <button onClick={this.handleOpenModal}>Add Brand</button>
                    <BrandModal
                        brandModalOpen={showModal}
                        saveBrand={this.saveBrand}
                        closeBrandModal={this.handleCloseModal}
                    />
                </div>
            </div>

            <div className="grid-row">
                <div className="grid-item--borderless field-label">
                    Frame Name
                </div>
                <div className="grid-item--borderless">
                    <FormTextInput
                        id="frameName"
                        fieldName="frameName"
                        placeholder="Frame Name"
                        value={frameName}
                        onChange={onChange}
                        size={100}
                    />
                </div>
            </div>
        </div>;
    }
}

export default BikeUploadFrame;
