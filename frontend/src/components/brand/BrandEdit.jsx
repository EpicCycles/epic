import React from 'react';
import * as PropTypes from 'prop-types';

import { generateRandomCode, removeObjectWithIndex, updateObject } from '../../helpers/utils';
import { Icon } from 'semantic-ui-react';
import { NEW_ELEMENT_ID } from '../../helpers/constants';
import SupplierBlob from '../supplier/SupplierBlob';
import { BIKE_BRAND_FIELD, BRAND_NAME_FIELD, brandFields } from '../app/model/helpers/fields';
import { updateModel } from '../app/model/helpers/model';
import EditModelInput from '../app/model/EditModelInput';

const BRAND_NAME_FIELD_BLANK = updateObject(BRAND_NAME_FIELD, { required: false });
class BrandEdit extends React.Component {
  handleBrandValueChange = (fieldName, input) => {
    const updatedBrand = updateModel(this.props.brand, brandFields, fieldName, input);
    if (!updatedBrand.brand_name) updatedBrand.delete = true;
    if (this.props.componentKey === NEW_ELEMENT_ID) updatedBrand.dummyKey = NEW_ELEMENT_ID;
    this.props.handleBrandChange(this.props.componentKey, updatedBrand);
  };
  removeSupplier = supplierKey => {
    let currentSuppliers = this.props.brand.supplier || [];
    const supplierIndex = currentSuppliers.indexOf(supplierKey);
    if (supplierIndex > -1) {
      const updatedSupplier = removeObjectWithIndex(currentSuppliers, supplierIndex);

      this.handleBrandValueChange('supplier', updatedSupplier);
    }
  };

  handleInputClear = fieldName => {
    if (window.confirm('Please confirm that you want to delete this Brand')) {
      const updatedBrand = updateObject(this.props.brand);
      updatedBrand.delete = true;
      this.props.handleBrandChange(this.props.componentKey, updatedBrand);
    }
  };

  addAnother = () => {
    const updatedBrand = updateObject(this.props.brand);
    updatedBrand.dummyKey = generateRandomCode();
    this.props.handleBrandChange(NEW_ELEMENT_ID, updatedBrand);
  };

  render() {
    const { brand, componentKey, pickUpBrand, suppliers } = this.props;
    const supplierForBrand = suppliers.filter(
      supplier => brand.supplier && brand.supplier.includes(supplier.id),
    );
    return (
      <div
        key={`brand${componentKey}`}
        className="rounded"
        draggable={pickUpBrand && componentKey.toString() !== NEW_ELEMENT_ID}
        onDragStart={event => pickUpBrand(event, componentKey)}
      >
        {componentKey.toString() === NEW_ELEMENT_ID && (
          <Icon name="add" onClick={this.addAnother} />
        )}
        <EditModelInput
          field={BRAND_NAME_FIELD_BLANK}
          model={brand}
          componentKey={componentKey}
          onChange={this.handleBrandValueChange}
        />
        <div className="row">
          <div className="field-label">{BIKE_BRAND_FIELD.header}</div>
          <EditModelInput
            field={BIKE_BRAND_FIELD}
            model={brand}
            componentKey={componentKey}
            onChange={this.handleBrandValueChange}
          />
        </div>
        Supplier(s):{' '}
        {supplierForBrand.length > 0
          ? supplierForBrand.map(supplier => (
              <SupplierBlob
                key={`supplier${componentKey}${supplier.id}`}
                supplier={supplier}
                componentKey={supplier.id}
                allowRemoval={true}
                removeFunction={this.removeSupplier}
              />
            ))
          : 'Unknown'}
      </div>
    );
  }
}
BrandEdit.defaultProps = {
  brand: {},
  suppliers: [],
};
BrandEdit.propTypes = {
  suppliers: PropTypes.array,
  brand: PropTypes.object,
  componentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteBrand: PropTypes.func,
  saveBrand: PropTypes.func,
  closeBrandModal: PropTypes.func,
};
export default BrandEdit;
