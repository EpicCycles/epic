import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';
import BrandSelect from '../brand/BrandSelect';
import FormTextInput from '../../common/FormTextInput';

class BikeUploadPartsEditPart extends React.Component {
  changePart = (fieldName, input) => {
    if (!input) {
      window.alert('Fields cannot be blank for new parts');
    }
    this.props.applyPartChange(
      this.props.sectionIndex,
      this.props.partTypeIndex,
      this.props.partIndex,
      fieldName,
      input,
    );
  };

  render() {
    const {
      brands,
      uploadPart,
      partIndex,
      partTypeIndex,
      sectionIndex,
      handleOpenModal,
    } = this.props;
    const componentKey = `_${sectionIndex}_${partTypeIndex}_${partIndex}`;
    return (
      <Fragment>
        <div className="grid-item--borderless row">
          <div className="row align_top">
            <BrandSelect
              key={`brand${componentKey}`}
              brands={brands}
              fieldName="brand"
              onChange={this.changePart}
              brandSelected={uploadPart.part.brand}
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
            fieldName="part_name"
            value={uploadPart.part.part_name}
            onChange={this.changePart}
            error={uploadPart.part.error}
            size={100}
          />
        </div>
        <div className="grid-item--borderless">{uploadPart.models.join()}</div>
      </Fragment>
    );
  }
}

export default BikeUploadPartsEditPart;
