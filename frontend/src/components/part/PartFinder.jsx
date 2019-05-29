import React from 'react';
import * as PropTypes from 'prop-types';

import {
  findObjectWithKey,
  updateObject,
  updateObjectWithSelectionChanges,
} from '../../helpers/utils';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import PartSelect from './PartSelect';
import { partFieldsComplete, supplierProductFields } from '../app/model/helpers/fields';
import { addFieldToState, checkForChangesAllFields } from '../app/model/helpers/model';
import { getModelFields, partReadyToUse } from './helpers/part';
import EditModelPage from '../app/model/EditModelPage';
import PartSearch from './PartSearch';
import { partSearchFields } from './helpers/search';
import { findMatchingObjects } from '../../helpers/search';
import { Prompt } from 'react-router';
const CHANGES_CONFIRM = 'You have made changes. Cancel and Save if you do not want to lose them.';

class PartFinder extends React.Component {
  state = {
    part: updateObject(this.props.part),
    persistedPart: this.props.part,
    partTypeSelected: this.props.part.partType,
    brandSelected: this.props.part.brand,
    searchFields: partSearchFields(this.props.sections, this.props.brands),
    filteredParts: [],
  };
  static getDerivedStateFromProps(props, state) {
    // Any time the current supplierProduct changes,
    // Reset any supplierProducts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (checkForChangesAllFields(partFieldsComplete, props.part, state.persistedPart)) {
      return {
        part: updateObject(props.part),
        persistedPart: updateObject(props.part),
      };
    }
    return null;
  }

  updateStateWithSelectionChanges = (fieldName, value) => {
    this.setState(updateObjectWithSelectionChanges(this.state, fieldName, value));
  };

  updatePartFieldsInState = (fieldName, value) => {
    const part = addFieldToState(this.state.part, partFieldsComplete, fieldName, value);
    this.updateStateWithSelectionChanges('part', part);
  };

  findParts = () => {
    const { searchFields } = this.state;
    const { parts } = this.props;
    const searchCriteria = this.getSearchCriteria();
    const filteredParts = findMatchingObjects(parts, searchFields, searchCriteria);
    this.setState({ filteredParts });
  };

  savePart = () => {
    this.props.savePart(this.state.part);
    this.updateStateWithSelectionChanges('persistedPart', this.state.part);
  };
  resetPart = () => {
    this.updateStateWithSelectionChanges('part', this.state.persistedPart);
  };
  deletePart = () => {
    const part = this.state.part;
    if (part.id) this.props.deletePart(part.id);
    this.setState(updateObject(this.state, { part: {}, persistedPart: {} }));
  };
  changePartViewed = (fieldName, partId) => {
    const part = findObjectWithKey(this.props.parts, partId);
    this.setState({ part: updateObject(part), persistedPart: part });
  };
  getSearchCriteria = () => {
    const {
      partTypeSelected,
      brandSelected,
      searchPartName,
      searchStandard,
      searchStocked,
    } = this.state;
    const searchCriteria = {
      partTypeSelected,
      brandSelected,
      searchPartName,
      searchStandard,
      searchStocked,
    };
    return searchCriteria;
  };

  render() {
    const { part, persistedPart, searchFields, filteredParts } = this.state;
    const {
      closeAction,
      sections,
      brands,
      parts,
      partActionPrimary,
      partActionPrimaryIcon,
      partActionPrimaryTitle,
      partActionSecondary,
      partActionSecondaryIcon,
      partActionSecondaryTitle,
    } = this.props;
    return (
      <div className="grid-container">
        <Prompt when={part.changed} message={CHANGES_CONFIRM} />

        <h2>Find Part</h2>
        {closeAction && (
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Icon name="remove" circular link onClick={() => closeAction(part)} />
          </div>
        )}
        <div key="partFinderFields" className={`grid`}>
          <PartSearch
            brands={brands}
            sections={sections}
            searchFields={searchFields}
            searchCriteria={this.getSearchCriteria()}
            onChange={this.updateStateWithSelectionChanges}
            findParts={this.findParts}
          />
          {filteredParts.length > 0 && (
            <div className="grid-row" key={`runSearchRow`}>
              <div className="grid-item--borderless field-label align_right" key={`selectStandard`}>
                Choose Part:
              </div>
              <div className="grid-item--borderless field-label ">
                <PartSelect
                  fieldName="partId"
                  brands={brands}
                  parts={filteredParts}
                  onChange={this.changePartViewed}
                  partSelected={part}
                />
              </div>
            </div>
          )}
        </div>
        <EditModelPage
          modelFields={getModelFields(part, !(part && part.id))}
          model={part}
          persistedModel={persistedPart}
          sections={sections}
          brands={brands}
          onChange={this.updatePartFieldsInState}
        />
        {part && (
          <div style={{ width: '100%', textAlign: 'right' }}>
            {part.changed && (
              <Icon
                id={`reset-part`}
                name="undo"
                onClick={this.resetPart}
                title="Reset Part details"
              />
            )}
            {partReadyToUse(part) && (
              <Icon
                key="primaryAction"
                name={partActionPrimaryIcon}
                onClick={() => partActionPrimary(part)}
                title={partActionPrimaryTitle}
              />
            )}
            {partActionSecondary && (
              <Icon
                key="secondaryAction"
                name={partActionSecondaryIcon}
                onClick={() => partActionSecondary(part)}
                title={partActionSecondaryTitle}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

PartFinder.defaultProps = {
  parts: [],
  part: {},
};
PartFinder.propTypes = {
  sections: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  parts: PropTypes.array,
  partType: PropTypes.number,
  part: PropTypes.object,
  findParts: PropTypes.func.isRequired,
  closeAction: PropTypes.func.isRequired,
  partActionPrimary: PropTypes.func.isRequired,
  partActionPrimaryIcon: PropTypes.string.isRequired,
  partActionPrimaryTitle: PropTypes.string.isRequired,
  partActionSecondary: PropTypes.func,
  partActionSecondaryIcon: PropTypes.string,
  partActionSecondaryTitle: PropTypes.string,
};

export default PartFinder;
