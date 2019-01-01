import React, {Fragment} from "react";
import {partFields, supplierProductFields} from "../../helpers/models";
import PartViewRow from "../part/PartViewRow";
import SupplierProductViewRow from "./SupplierProductViewRow";

class SupplierProductUploadReview extends React.Component {
    saveData = () => {
        let { apiData } = this.props;

        this.props.uploadParts(apiData.parts);
    };

    render() {
        const { apiData, brands, sections, suppliers } = this.props;
        return <Fragment key="reviewSuplierProducts">
            <div>
                <Button
                    key="bikeFileUploadCont"
                    onClick={this.saveData}
                >
                    Upload data
                </Button>
            </div>
            <div key="partTypes" className="grid"
                 style={{ height: (window.innerHeight * 0.8) + "px", overflow: "scroll" }}>
                <div className="grid-row grid-row--header ">
                    <div className="grid-item--header grid-header--fixed-left">
                        SupplierProduct
                    </div>
                    {partFields.map((field, index) => {
                        return <div
                            className={`grid-item--header ${(index === 0) && "grid-header--fixed-left"}`}
                            key={`partHead${field.fieldName}`}
                        >
                            {field.header}
                        </div>;
                    })}
                    {supplierProductFields.map(field => {
                        return <div
                            className={`grid-item--header`}
                            key={`partHead${field.fieldName}`}
                        >
                            {field.header}
                        </div>;
                    })}
                    <div
                        className={`grid-item--header`}
                    >
                        Errors
                    </div>
                </div>
                <Fragment>
                    {apiData.parts.map((part, partIndex) =>
                        <div className="grid-row" key={`partRow${partIndex}`}>
                            <PartViewRow
                                part={part}
                                supplierProducts={[part.supplierProduct]}
                                lockFirstColumn={true}
                                sections={sections}
                                brands={brands}
                            />
                            <SupplierProductViewRow
                                supplierProduct={part.supplierProduct}
                                suppliers={suppliers}
                            />
                            <div className="grid-item">
                                {part.error && part.error_detail.join()}
                            </div>
                        </div>)}
                </Fragment>
            </div>

        </Fragment>;
    }
}


export default SupplierProductUploadReview;