import React from 'react';
import * as PropTypes from 'prop-types';
import { buildViewString, gridHeaderClass, gridItemClass } from './helpers/display';
import { getModelKey } from './helpers/model';

const ModelFieldRow = props => {
  const {
    firstRow,
    modelArray,
    field,
    sections,
    brands,
    bikes,
    frames,
    suppliers,
    customers,
    users,
    className,
  } = props;
  const rowClass = firstRow ? 'grid-row--header' : '';
  const cellClass = firstRow
    ? gridHeaderClass(className, 1, true)
    : gridItemClass(className, 1, true);
  const nameClass = firstRow
    ? gridHeaderClass(className, 0, true)
    : gridItemClass(className, 1, true);

  return (
    <div key="bikeReviewHeaders" className={`grid-row ${rowClass}`}>
      <div className={nameClass} key={`modelHead${field.fieldName}`} data-test="model-field-header">
        {field.header}
      </div>
      {modelArray.map(modelInstance => {
        const modelKey = getModelKey(modelInstance);
        return (
          <div
            className={cellClass}
            data-test="part-type-header"
            key={`${field.field_name}_${modelKey}`}
          >
            {buildViewString(
              modelInstance,
              field,
              sections,
              brands,
              suppliers,
              customers,
              bikes,
              frames,
              users,
            )}
          </div>
        );
      })}
    </div>
  );
};
ModelFieldRow.defaultProps = {
  modelArray: [],
  firstRow: false,
  sections: [],
  brands: [],
  bikes: [],
  frames: [],
  suppliers: [],
  customers: [],
  users: [],
  className: '',
};
ModelFieldRow.propTypes = {
  modelArray: PropTypes.array,
  field: PropTypes.object.isRequired,
  firstRow: PropTypes.bool,
  sections: PropTypes.array,
  brands: PropTypes.array,
  bikes: PropTypes.array,
  frames: PropTypes.array,
  suppliers: PropTypes.array,
  customers: PropTypes.array,
  users: PropTypes.array,
  className: PropTypes.string,
};
export default ModelFieldRow;
