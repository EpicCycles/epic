/* eslint-disable react/destructuring-assignment */
import React from 'react';

import * as PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import PartTypeData from './PartTypeData';
import { SECTION_MISSING } from '../app/model/helpers/error';
import SelectInput from '../../common/SelectInput';
import { processPartTypeValueChanges } from './helpers/partType';

class PartTypeModal extends React.Component {
  constructor(props) {
    super();
    this.state = this.deriveStateFromProps(props);
  }

  deriveStateFromProps = props => {
    const { sections, partType } = props;
    const sectionOptions = sections.map(section => {
      return { name: section.name, value: section.id.toString() };
    });
    return {
      sectionOptions,
      partType: partType || {},
      mode: partType && partType.id ? 'Edit' : 'New',
    };
  };

  handlePartTypeValueChange = (fieldName, input) => {
    const { partType, componentKey } = this.state;
    const updatedPartType = processPartTypeValueChanges(partType, componentKey, fieldName, input);
    if (fieldName.startsWith('includeInSection')) updatedPartType.includeInSection = input;
    if (!updatedPartType.includeInSection) {
      if (updatedPartType.error) {
        updatedPartType.error_detail = `${SECTION_MISSING}.${updatedPartType.error_detail}`;
      } else {
        updatedPartType.error = true;
        updatedPartType.error_detail = SECTION_MISSING;
      }
    }
    this.setState({ partType: updatedPartType });
  };

  onClickReset = () => {
    this.setState(this.deriveStateFromProps(this.props));
  };

  saveOrCreatePartType = () => {
    this.props.savePartType(this.state.partType);
    this.props.closePartTypeModal();
  };

  deleteOrRemovePartType = () => {
    if (this.state.componentKey) {
      this.props.deletePartType(this.state.partType);
    }
    this.props.closePartTypeModal();
  };

  render() {
    const { partTypeModalOpen, componentKey, deletePartType, closePartTypeModal } = this.props;
    const { partType, mode, sectionOptions } = this.state;
    return (
      <div>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <Icon name="remove" circular link onClick={closePartTypeModal} />
        </div>
        {partTypeModalOpen && (
          <div style={{ width: '100%', textAlign: 'left' }}>
            <h2>{mode} Part Type</h2>
            {partType.error && <div className="red">{partType.error_detail}</div>}
            <div>
              <SelectInput
                className=""
                title="Select Section"
                label="Section"
                fieldName="includeInSection"
                onChange={this.handlePartTypeValueChange}
                value={partType.includeInSection && partType.includeInSection.toString()}
                options={sectionOptions}
                isEmptyAllowed
              />
            </div>
            <PartTypeData
              partType={partType}
              componentKey={componentKey}
              handlePartTypeValueChange={this.handlePartTypeValueChange}
            />
          </div>
        )}
        <div style={{ width: '100%', textAlign: 'right' }}>
          {partType.changed && (
            <Icon
              id="reset-partType"
              name="undo"
              onClick={this.onClickReset}
              title="Reset PartType details"
            />
          )}
          {partType.changed && !partType.error && (
            <Icon
              id="accept-partType"
              name="check"
              onClick={this.saveOrCreatePartType}
              title="Confirm PartType Change"
            />
          )}
          {deletePartType && (partType.id || partType.changed) && (
            <Icon
              id="delete-partType"
              name="trash"
              onClick={this.deleteOrRemovePartType}
              title="Delete PartType"
            />
          )}
        </div>
      </div>
    );
  }
}

PartTypeModal.propTypes = {
  partTypeModalOpen: PropTypes.any,
  partType: PropTypes.any,
  componentKey: PropTypes.any,
  savePartType: PropTypes.any,
  sections: PropTypes.any,
  closePartTypeModal: PropTypes.func,
  deletePartType: PropTypes.any,
};

export default PartTypeModal;
