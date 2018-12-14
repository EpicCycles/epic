import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import React, {Fragment} from "react";
import {Icon} from "semantic-ui-react";

class BikeUploadPartsEditPart extends React.Component {

    changePart = (fieldName, input) => {
        if (!input) {
            window.alert("Fields cannot be blank for new parts");
        }
        this.props.applyPartChange(
            this.props.sectionIndex,
            this.props.partTypeIndex,
            this.props.partIndex,
            fieldName,
            input
        );
    };

    render() {
        const {
            brands,
            uploadPart,
            partIndex,
            partTypeIndex,
            sectionIndex,
            handleOpenModal
        } = this.props;
        const componentKey = `_${sectionIndex}_${partTypeIndex}_${partIndex}`;
        return <Fragment>
            <div className="grid-item--borderless row">
                <div className="row align_top">
                    <BrandSelect
                        key={`partBrand${componentKey}`}
                        brands={brands}
                        fieldName="partBrand"
                        onChange={this.changePart}
                        brandSelected={uploadPart.part.partBrand}
                    />
                    <Icon
                        key={`addBrand${componentKey}`}
                        name="add circle"
                        onClick={handleOpenModal}
                        title="Add new brand"
                    />
                </div>
            </div>
            <div className="grid-item--borderless">
                <FormTextInput
                    key={`partName${componentKey}`}
                    fieldName={`partName`}
                    value={uploadPart.part.partName}
                    onChange={this.changePart}
                    error={uploadPart.part.error}
                    size={100}
                />
            </div>
            <div className="grid-item--borderless">
                {uploadPart.models.join()}
            </div>

        </Fragment>
    }
}

export default BikeUploadPartsEditPart;
