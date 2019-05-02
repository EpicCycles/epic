import React from 'react';

import * as PropTypes from 'prop-types';
import SelectInput from '../../common/SelectInput';
import { getModelKey } from '../app/model/helpers/model';

const SupplierSelect = props => {
  const {
    suppliers,
    fieldName,
    onChange,
    supplierSelected,
    isEmptyAllowed,
    isMultiple,
    multipleSize,
    error,
    disabled,
  } = props;
  const supplierOptions = suppliers
    ? suppliers.map(supplier => {
        return {
          value: getModelKey(supplier).toString(),
          name: supplier.supplier_name,
        };
      })
    : [];
  return (
    <SelectInput
      fieldName={fieldName}
      onChange={onChange}
      value={supplierSelected ? supplierSelected.toString() : ''}
      options={supplierOptions}
      isEmptyAllowed={isEmptyAllowed}
      isMultiple={isMultiple}
      multipleSize={multipleSize}
      error={error}
      disabled={disabled}
    />
  );
};
SupplierSelect.defaultProps = {
  suppliers: [],
  fieldName: 'supplier',
  isEmptyAllowed: false,
  error: '',
  disabled: false,
};
SupplierSelect.propTypes = {
  fieldName: PropTypes.string,
  suppliers: PropTypes.array,
  supplierSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onChange: PropTypes.func,
  isEmptyAllowed: PropTypes.bool,
  isMultiple: PropTypes.bool,
  multipleSize: PropTypes.number,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};
export default SupplierSelect;
