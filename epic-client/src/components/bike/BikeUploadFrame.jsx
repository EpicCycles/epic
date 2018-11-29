import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import React from "react";

const BikeUploadFrame = (props) => {
    return <div key='bikeUpload' className="grid">
        <div className="grid-row">
            <div className="grid-item--borderless field-label">
                Bike Brand
            </div>
            <div className="grid-item--borderless">
                <BrandSelect
                    brands={props.brands}
                    fieldName="brand"
                    onChange={props.onChange}
                    brandSelected={props.brandSelected}
                    isEmptyAllowed={props.isEmptyAllowed}
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
                    value={props.frameName}
                    onChange={props.onChange}
                    size={100}
                />
            </div>
        </div>
    </div>;
}

export default BikeUploadFrame;
