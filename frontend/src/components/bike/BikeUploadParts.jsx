import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import BrandModal from '../brand/BrandModal';
import { NEW_ELEMENT_ID } from '../../helpers/constants';
import BikeUploadPartsEditPart from './BikeUploadPartsEditPart';
import { updateObject } from '../../helpers/utils';

class BikeUploadParts extends React.Component {
  constructor(props) {
    super();
    this.state = this.deriveStateFromProps(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  deriveStateFromProps = props => {
    const { apiData, sections } = props;
    const partTypeParts = [];
    const partTypesPresent = [];

    apiData.bikes.forEach((bike, bikeIndex) => {
      bike.parts.forEach((bikePart, partIndex) => {
        if (!partTypesPresent.includes(bikePart.partType)) {
          partTypesPresent.push(bikePart.partType);
          partTypeParts.push({
            partType: bikePart.partType,
            parts: [],
          });
        }

        const added = partTypeParts[partTypesPresent.indexOf(bikePart.partType)].parts.some(
          addedPart => {
            if (
              addedPart.part.partName === bikePart.partName &&
              addedPart.part.brand === bikePart.brand
            ) {
              addedPart.uses.push({ bikeIndex, partIndex });
              addedPart.models.push([bike.model_name]);
              return true;
            }
            return false;
          },
        );
        if (!added) {
          partTypeParts[partTypesPresent.indexOf(bikePart.partType)].parts.push({
            part: bikePart,
            uses: [{ bikeIndex, partIndex }],
            models: [bike.model_name],
          });
        }
      });
    });

    const displayData = [];
    sections.forEach(section => {
      const partTypesWithParts = [];
      section.partTypes.forEach(partType => {
        const partTypesPresentIndex = partTypesPresent.indexOf(partType.id);
        if (partTypesPresentIndex > -1) {
          partTypesWithParts.push({
            name: partType.name,
            uploadParts: partTypeParts[partTypesPresentIndex].parts,
          });
        }
      });
      if (partTypesWithParts.length > 0) {
        displayData.push({
          name: section.name,
          partTypes: partTypesWithParts,
        });
      }
    });
    return {
      displayData,
      showModal: false,
    };
  };
  goToNextStep = () => {
    let { apiData } = this.props;
    const { displayData } = this.state;
    displayData.forEach(section => {
      section.partTypes.forEach(partType => {
        partType.uploadParts.forEach(uploadPart => {
          if (uploadPart.part.changed) {
            uploadPart.uses.forEach(use => {
              apiData.bikes[use.bikeIndex].parts[use.partIndex].brand = uploadPart.part.brand;
              apiData.bikes[use.bikeIndex].parts[use.partIndex].partName = uploadPart.part.partName;
            });
          }
        });
      });
    });
    this.props.uploadFrame(apiData);
    this.props.addDataAndProceed({ apiData });
  };
  applyPartChange = (sectionIndex, partTypeIndex, partIndex, fieldName, input) => {
    let updatedDisplayData = this.state.displayData.slice();
    let updatedSection = updatedDisplayData[sectionIndex];
    let updatedPartType = updatedSection.partTypes[partTypeIndex];
    let updatedPartData = updateObject(updatedPartType.uploadParts[partIndex]);
    let updatedPart = updateObject(updatedPartData.part);

    updatedPart[fieldName] = input;
    updatedPart.changed = true;
    if (!input) {
      updatedPart.error = 'Part Name must be entered.';
    } else {
      updatedPart.error = '';
    }
    updatedPartData.part = updatedPart;
    updatedPartType.uploadParts.splice(partIndex, 1, updatedPartData);
    this.setState({ displayData: updatedDisplayData });
  };

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  saveBrand = brand => {
    const brandsWithUpdates = this.props.brands.slice();
    brandsWithUpdates.push(brand);
    this.props.saveBrands(brandsWithUpdates);
    this.props.recheckBrands();
  };

  render() {
    const { showModal, displayData } = this.state;
    const { brands } = this.props;

    return (
      <Fragment key="bikeUploadParts">
        <div>
          <Button key="bikeFileUploadCont" onClick={this.goToNextStep}>
            Upload data and Continue
          </Button>
          <Button key="addNewBrand" onClick={this.handleOpenModal}>
            Add Brand
          </Button>
          {showModal && (
            <BrandModal
              key="brandModalInPartList"
              brandModalOpen={showModal}
              componentKey={NEW_ELEMENT_ID}
              saveBrand={this.saveBrand}
              closeBrandModal={this.handleCloseModal}
              brands={brands}
            />
          )}
        </div>
        <section key="partData" className="row" id="partData">
          <div
            key="partList"
            className="grid"
            style={{ height: window.innerHeight * 0.8 + 'px', overflow: 'scroll' }}
          >
            <div className="grid-row grid-row--header ">
              <div className="grid-item--header">Section</div>
              <div className="grid-item--header">Part Type</div>
              <div className="grid-item--header">Brand</div>
              <div className="grid-item--header">Part Name</div>
              <div className="grid-item--header">Models</div>
            </div>
            <Fragment>
              {displayData.map((section, sectionIndex) => {
                return section.partTypes.map((partType, partTypeIndex) => {
                  return partType.uploadParts.map((uploadPart, partIndex) => (
                    <div className="grid-row">
                      <div
                        className="grid-item--borderless field-label red"
                        key={`section${sectionIndex}${partTypeIndex}${partIndex}`}
                      >
                        {partTypeIndex === 0 && partIndex === 0 ? section.name : ' '}
                      </div>
                      <div
                        key={`partType${sectionIndex}${partTypeIndex}${partIndex}`}
                        className="grid-item--borderless field-label align_right"
                      >
                        {partIndex === 0 ? partType.name : ' '}
                      </div>
                      <BikeUploadPartsEditPart
                        key={`partEdit${sectionIndex}${partTypeIndex}${partIndex}`}
                        brands={brands}
                        uploadPart={uploadPart}
                        partIndex={partIndex}
                        partTypeIndex={partTypeIndex}
                        sectionIndex={sectionIndex}
                        handleOpenModal={this.handleOpenModal}
                        applyPartChange={this.applyPartChange}
                      />
                    </div>
                  ));
                });
              })}
            </Fragment>
          </div>
        </section>
      </Fragment>
    );
  }
}

export default BikeUploadParts;
