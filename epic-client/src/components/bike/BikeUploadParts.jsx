import React, {Fragment} from "react";
import {Button, Icon} from "semantic-ui-react";

class BikeUploadParts extends React.Component {
    constructor(props) {
        super();
        this.state = this.deriveStateFromProps(props);
    };

    deriveStateFromProps = (props) => {
        const { sections, apiData } = props;
        const displayData = [];
        const partTypesPresent = [];

        apiData.bikes.forEach((bike, bikeIndex) =>{
            bike.parts.forEach((bikePart, partIndex) => {
                if (! partTypesPresent.includes(bikePart.partType)) {
                    partTypesPresent.push(bikePart.partType);
                    displayData.push({
                        partType:bikePart.partType,
                        parts: []
                    });
                }

                const added = displayData[partTypesPresent.indexOf(bikePart.partType)].parts.some(part =>{
                    if ((part.partName === bikePart.partName) && (part.partBrand === bikePart.partbrand)) {
                        part.uses.push({bikeIndex, partIndex});
                        return true;
                    }
                    return false;
                });
                if (! added) {
                    displayData[partTypesPresent.indexOf(bikePart.partType)].parts.push({
                        part: bikePart,
                        uses: [{bikeIndex, partIndex}]
                    });
                }
            })
        });
        return {
            displayData
        };
    };
    goToNextStep = () => {
        let { apiData } = this.props;
        const {displayData} = this.state;

        displayData.forEach(partType => {
            partType.parts.forEach(part => {
                if (part.changed) {
                    part.uses.forEach(use => {
                        apiData.bikes[use.bikeIndex].parts[use.partIndex].partBrand = part.partBrand;
                        apiData.bikes[use.bikeIndex].parts[use.partIndex].partName = part.partName;
                    })
                }
            })
        });

        this.props.addDataAndProceed({ apiData });
    };


    render() {
        const { rowMappings } = this.state;
        const { uploadedHeaders, uploadedData } = this.props;
        return <Fragment key="bikeUploadParts">
            <div>
                <Button
                    key="bikeFileUploadCont"
                    onClick={this.goToNextStep}
                >
                    Upload data and Continue
                </Button>
            </div>
        </Fragment>;
    }
}


//
// };


export default BikeUploadParts;