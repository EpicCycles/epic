import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import React, {Fragment} from "react";
import BrandModal from "../brand/BrandModal";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

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
    };

    render() {
        const { showModal } = this.state;
        const { brands, suppliers, onChange, brandSelected, displayOnly, frameName, brandName } = this.props;
        return <div key='bikeUpload' className="grid">
            <div className="grid-row">
                <div className="grid-item--borderless field-label">
                    Bike Brand
                </div>
                <div className="grid-item--borderless">
                    {displayOnly ?
                        <Fragment>{brandName}</Fragment>
                        :
                        <Fragment>
                            <BrandSelect
                                brands={brands}
                                fieldName="brand"
                                onChange={onChange}
                                brandSelected={brandSelected}
                                isEmptyAllowed={true}
                                bikeOnly={true}
                            />
                            <button onClick={this.handleOpenModal}>Add Brand</button>
                            {showModal && <BrandModal
                                brandModalOpen={showModal}
                                componentKey={NEW_ELEMENT_ID}
                                saveBrand={this.saveBrand}
                                closeBrandModal={this.handleCloseModal}
                                suppliers={suppliers}
                            />}
                        </Fragment>
                    }
                </div>
            </div>

            <div className="grid-row">
                <div className="grid-item--borderless field-label">
                    Frame Name
                </div>
                <div className="grid-item--borderless">
                    {displayOnly ?
                        <Fragment>{frameName}</Fragment>
                        :
                        <FormTextInput
                            id="frameName"
                            fieldName="frameName"
                            placeholder="Frame Name"
                            value={frameName}
                            onChange={onChange}
                            size={100}
                        />
                    }
                </div>
            </div>
        </div>;
    }
}

export default BikeUploadFrame;
