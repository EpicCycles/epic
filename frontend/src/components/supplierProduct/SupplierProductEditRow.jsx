import React from 'react';
import * as PropTypes from 'prop-types';
import { supplierProductFields } from '../app/model/helpers/fields';
import { checkForChangesAllFields, updateModel } from '../app/model/helpers/model';
import { updateObject } from '../../helpers/utils';
import EditModelRow from '../app/model/EditModelRow';

class SupplierProductEditRow extends React.Component {
  state = {
    supplierProduct: updateObject(this.props.supplierProduct),
    persistedSupplierProduct: updateObject(this.props.supplierProduct),
  };
  static getDerivedStateFromProps(props, state) {
    // Any time the current supplierProduct changes,
    // Reset any supplierProducts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (
      checkForChangesAllFields(
        supplierProductFields,
        props.supplierProduct,
        state.persistedSupplierProduct,
      )
    ) {
      return {
        supplierProduct: updateObject(props.supplierProduct),
        persistedSupplierProduct: updateObject(props.supplierProduct),
      };
    }
    return null;
  }
  handleInputChange = (fieldName, input) => {
    let { supplierProduct } = this.state;
    supplierProduct = updateModel(supplierProduct, supplierProductFields, fieldName, input);
    this.setState({ supplierProduct });
  };
  resetSupplierProduct = () => {
    const { persistedSupplierProduct } = this.state;
    const supplierProduct = updateObject(persistedSupplierProduct);
    this.setState({ supplierProduct });
  };
  render() {
    const { supplierProduct, persistedSupplierProduct } = this.state;
    const { suppliers, lockFirstColumn, saveSupplierProduct, deleteSupplierProduct } = this.props;
    return (
      <EditModelRow
        model={supplierProduct}
        persistedModel={persistedSupplierProduct}
        modelFields={supplierProductFields}
        onChange={this.handleInputChange}
        suppliers={suppliers}
        lockFirstColumn={lockFirstColumn}
        actionsRequired
        modelSave={saveSupplierProduct}
        modelDelete={deleteSupplierProduct}
        modelReset={this.resetSupplierProduct}
        showReadOnlyFields
      />
    );
  }
}

SupplierProductEditRow.propTypes = {
  supplierProduct: PropTypes.any,
  lockFirstColumn: PropTypes.bool,
  suppliers: PropTypes.any,
  saveSupplierProduct: PropTypes.func,
  deleteSupplierProduct: PropTypes.func,
};

export default SupplierProductEditRow;
