/* eslint-disable camelcase,jsx-a11y/label-has-associated-control,react/prop-types,react/prop-types,react/destructuring-assignment */
import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';
import FormTextInput from '../../common/FormTextInput';
import AttributeOptions from './AttributeOptions';
import SelectInput from '../../common/SelectInput';
import { NEW_ELEMENT_ID } from '../../helpers/constants';
import { generateRandomCode, updateObject } from '../../helpers/utils';
import { ATTRIBUTE_OPTION_TYPES } from './helpers/partTypeAttribute';

class PartTypeAttributeEdit extends React.Component {
  handleInputChange = (fieldName, input) => {
    const updatedAttribute = updateObject(this.props.attribute);
    if (fieldName.startsWith('attribute_name')) updatedAttribute.attribute_name = input;
    if (!updatedAttribute.attribute_name) {
      updatedAttribute.error = true;
      updatedAttribute.error_detail = 'A name is required for the attribute';
    } else {
      updatedAttribute.error = false;
      updatedAttribute.error_detail = '';
    }
    if (fieldName.startsWith('in_use')) updatedAttribute.in_use = input;
    if (fieldName.startsWith('mandatory')) updatedAttribute.mandatory = input;
    if (fieldName.startsWith('attribute_type')) updatedAttribute.attribute_type = input;
    if (fieldName.startsWith('options')) updatedAttribute.options = input;
    if (this.props.componentKey === NEW_ELEMENT_ID) updatedAttribute.dummyKey = NEW_ELEMENT_ID;

    if (!fieldName.startsWith('options')) updatedAttribute.changed = true;

    this.props.handleAttributeChange(this.props.componentKey, updatedAttribute);
  };

  handleInputClear = () => {
    const updatedAttribute = updateObject(this.props.attribute);
    // eslint-disable-next-line no-alert
    if (window.confirm('This will remove this attribute, are you sure?')) {
      updatedAttribute.delete = true;
      this.props.handleAttributeChange(this.props.componentKey, updatedAttribute);
    }
  };

  addAnother = () => {
    const updatedAttribute = updateObject(this.props.attribute);
    updatedAttribute.dummyKey = generateRandomCode();
    this.props.handleAttributeChange(NEW_ELEMENT_ID, updatedAttribute);
  };

  render() {
    const { attribute, componentKey } = this.props;
    const inUseId = `in_use_${componentKey}`;
    const mandatoryId = `mandatory_${componentKey}`;
    const attribute_typeId = `attribute_type_${componentKey}`;
    const attributeOptions = attribute.options || [];
    return (
      <Fragment>
        <td>
          <FormTextInput
            placeholder="add new"
            fieldName={`attribute_name_${componentKey}`}
            value={attribute.attribute_name}
            onChange={this.handleInputChange}
            onClick={this.handleInputClear}
          />
          {componentKey === NEW_ELEMENT_ID && (
            <Icon name="add" onClick={this.addAnother} title="confirm new Attribute" />
          )}
          <label htmlFor={inUseId}>&nbsp;In Use?&nbsp;</label>
          <input
            type="checkbox"
            name={inUseId}
            id={inUseId}
            onChange={event => this.handleInputChange(event.target.name, !attribute.in_use)}
            checked={attribute.in_use}
          />
          <label htmlFor={mandatoryId}>&nbsp;Mandatory?&nbsp;</label>

          <input
            type="checkbox"
            name={mandatoryId}
            id={mandatoryId}
            onChange={event => this.handleInputChange(event.target.name, !attribute.mandatory)}
            checked={attribute.mandatory}
          />
          <br />
          <label htmlFor={attribute_typeId}>&nbsp;Type:&nbsp;</label>
          <SelectInput
            fieldName={attribute_typeId}
            options={ATTRIBUTE_OPTION_TYPES}
            onChange={this.handleInputChange}
            value={attribute.attribute_type}
          />
        </td>
        <td>
          {componentKey !== NEW_ELEMENT_ID && (
            <AttributeOptions
              attributeKey={componentKey}
              options={attributeOptions}
              handleAttributeChange={this.handleInputChange}
            />
          )}
        </td>
      </Fragment>
    );
  }
}

export default PartTypeAttributeEdit;
