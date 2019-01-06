import React, {Fragment} from "react";
import PartViewRow from "../part/PartViewRow";
import SupplierProductViewRow from "./SupplierProductViewRow";
import SupplierProductHeaders from "./SupplierProductHeaders";
import {Button} from "semantic-ui-react";

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
                <SupplierProductHeaders/>
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
            </div>

        </Fragment>;
    }
}


export default SupplierProductUploadReview;