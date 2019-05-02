/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { gridHeaderClass } from './helpers/display';

const ModelTableHeaders = props => (
  <Fragment>
    {props.modelFields.map((field, index) => (
      <div
        className={gridHeaderClass(props.className, index, props.lockFirstColumn)}
        key={`modelHead${field.fieldName}`}
        data-test="model-field-header"
      >
        {field.header}
      </div>
    ))}
  </Fragment>
);

ModelTableHeaders.defaultProps = {
  className: '',
};
ModelTableHeaders.propTypes = {
  modelFields: PropTypes.array.isRequired,
  className: PropTypes.string,
  lockFirstColumn: PropTypes.bool,
};
export default ModelTableHeaders;
