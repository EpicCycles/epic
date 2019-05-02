import React, { Fragment } from 'react';
import {Icon} from "semantic-ui-react";
import FormTextInput from "../../common/FormTextInput";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import { BRAND_FIELD, PART_NAME_FIELD, PART_TYPE_FIELD, partFields, TRADE_IN_PRICE_FIELD } from '../app/model/helpers/fields';
import { getUpdatedObject, isItAnObject, updateObject } from '../../helpers/utils';
import BrandSelect from '../brand/BrandSelect';
import PartTypeSelect from '../partType/PartTypeSelect';
import PartDataList from './PartDataList';
import * as PropTypes from 'prop-types';
import { addFieldToState, checkForChanges } from '../app/model/helpers/model';
import { validateData } from '../app/model/helpers/validators';

const initialState = {
  partType: '',
  brand: '',
  part_name: '',
  trade_in_price: '',
  standard: false,
  stocked: false,
  errors: {},
};

class PartEdit extends React.Component {
  state = initialState;

  componentWillMount() {
      this.setState(this.deriveStateFromProps());
  }

  checkForChanges = stateBeforeSetting => {
    const originalPart = this.props.part;
      if (isItAnObject(originalPart)) {
        return checkForChanges(partFields, originalPart, stateBeforeSetting || this.state);
    } else {
        return checkForChanges(partFields, initialState, stateBeforeSetting || this.state);
    }
  };

  deriveStateFromProps = () => {
    const newState = initialState;
      if (this.props.part) {
      updateObject(newState, this.props.part);
      }
    this.checkPartDataList(newState);
      return newState;
  };

  handleInputChange = (fieldName, input) => {
    const newState = addFieldToState(this.state, partFields, fieldName, input);

      if (this.checkForChanges(newState)) {
      newState.errors = validateData(partFields, newState);
      }

    this.checkPartDataList(newState);
      this.setState(newState);
  };

  onClickReset = () => {
    const resetState = this.deriveStateFromProps();
      this.setState(resetState);
      this.checkPartDataList(resetState);
  };

  // get a new part list only if this part hasn't got an id
  checkPartDataList(newState) {
      console.warn('not implemented');
    // if ((!newState.id) && getNewDataListRequired(this.props.partDataList, newState.brand, newState.partType)) {
      //     this.props.getPartDataList(newState.brand, newState.partType);
      // }
  }

  saveOrCreatePart = () => {
    const updatedPart = getUpdatedObject(partFields, this.props.part, this.state);
    this.props.savePart(updatedPart);
      if (this.props.closeModal) {
        this.props.closeModal();
      }
  };

  deleteOrRemovePart = () => {
      if (this.state.id) {
        this.props.deletePart(this.state.id);
    }
    this.setState(initialState);
      if (this.props.closeModal) {
        this.props.closeModal();
      }
  };

  render() {
      const { id, partType, part_name, brand, trade_in_price, standard, stocked, errors } = this.state;
    const { closeModal, sections, brands, partDataList, partTypeEditable, deletePart } = this.props;
      const componentKey = id || NEW_ELEMENT_ID;
      const isChanged = this.checkForChanges();

      return (
<Fragment>
            {closeModal && <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    name="remove"
                    circular
                    link
                    onClick={closeModal}
                />
            </div>}
            <div style={{ width: "100%", textAlign: "left" }}>
                <h2>Edit Part</h2>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Part Type
                    </div>
                    <div className="grid-item--borderless">
                        <PartTypeSelect
                            sections={sections}
                            fieldName="partType"
                            onChange={this.handleInputChange}
                            partTypeSelected={partType}
                            isEmptyAllowed={true}
                            error={errors[PART_TYPE_FIELD.fieldName]}
                            disabled={!partTypeEditable}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Brand
                    </div>
                    <div className="grid-item--borderless">
                        <BrandSelect
                            brands={brands}
                            fieldName="brand"
                            onChange={this.handleInputChange}
                            brandSelected={brand}
                            isEmptyAllowed={true}
                            error={errors[BRAND_FIELD.fieldName]}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Part Name
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextInput
                            placeholder="Part name"
                            key={`part_name_${componentKey}`}
                            fieldName={`part_name_${componentKey}`}
                            value={part_name}
                            onChange={this.handleInputChange}
                            error={errors[PART_NAME_FIELD.fieldName]}
                        />
                        <PartDataList
                            dataListId={`part_name_${componentKey}`}
                            partDataList={partDataList}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        {TRADE_IN_PRICE_FIELD.header}
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextInput
                            key={`${TRADE_IN_PRICE_FIELD.fieldName}_${componentKey}`}
                            fieldName={`${TRADE_IN_PRICE_FIELD.fieldName}_${componentKey}`}
                            value={trade_in_price}
                            onChange={this.handleInputChange}
                            error={errors[TRADE_IN_PRICE_FIELD.fieldName]}
                            dataType="number"
                        />
                        <PartDataList
                            dataListId={`part_name_${componentKey}`}
                            partDataList={partDataList}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Standard part?
                    </div>
                    <div className="grid-item--borderless">
                        <input type="checkbox"
                               name="standard"
                               onChange={() => this.handleInputChange("standard", !standard)}
                               checked={standard ? standard : false}
                        />
                    </div>
                </div>
                {standard && <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Stocked part?
                    </div>
                    <div className="grid-item--borderless">
                        <input type="checkbox"
                               name="stocked"
                               onChange={() => this.handleInputChange("stocked", !stocked)}
                               checked={stocked ? stocked : false}
                        />
                    </div>
                </div>
                }
            </div>
            <div style={{ width: "100%", textAlign: "right" }}>
                {isChanged &&
                <Icon id={`reset-part`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Part details"
                />
                }
                {(isChanged && !isItAnObject(errors)) &&
                <Icon id={`accept-part`} name="check"
                      onClick={this.saveOrCreatePart}
                      title="Confirm Part Change"
                />
                }
                {(deletePart && (id || isChanged)) &&
                <Icon id={`delete-part`} name="trash"
                      onClick={this.deleteOrRemovePart}
                      title="Delete Part"
                />
                }
            </div>
        </Fragment>
);
    );
  }
}
PartEdit.propTypes = {
  part: PropTypes.any,
  partTypeEditable: PropTypes.any,
  getPartList: PropTypes.func,
  componentKey: PropTypes.any,
  sections: PropTypes.any,
  brands: PropTypes.any,
  savePart: PropTypes.func,
  deletePart: PropTypes.func,
  closeModal: PropTypes.func,
};
export default PartEdit;
