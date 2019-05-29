import React from 'react';
import * as PropTypes from 'prop-types';

import { updateObject } from '../../helpers/utils';
import { partFieldsComplete } from '../app/model/helpers/fields';
import { checkForChangesAllFields, getModelKey, updateModel } from '../app/model/helpers/model';
import SupplierProductEditRow from './SupplierProductEditRow';
import EditModelRow from '../app/model/EditModelRow';
import { getRelevantSupplierProducts, newSupplierProduct } from '../part/helpers/supplierProduct';

class SupplierProductReviewPart extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (checkForChangesAllFields(partFieldsComplete, props.part, state.persistedPart)) {
      return {
        part: updateObject(props.part),
        persistedPart: updateObject(props.part),
      };
    }
    return null;
  }

  state = {
    part: updateObject(this.props.part),
    persistedPart: updateObject(this.props.part),
    supplierProducts: getRelevantSupplierProducts(this.props.part, this.props.supplierProducts),
  };

  handleInputChange = (fieldName, input) => {
    let { part } = this.state;
    part = updateModel(part, partFieldsComplete, fieldName, input);
    this.setState({ part });
  };

  resetPart = () => {
    const { persistedPart } = this.state;
    const part = updateObject(persistedPart);
    this.setState({ part });
  };

  render() {
    const { part, persistedPart } = this.state;
    const {
      brands,
      suppliers,
      sections,
      supplierProducts,
      savePart,
      deletePart,
      saveSupplierProduct,
      deleteSupplierProduct,
    } = this.props;
    const supplierProductsForPart = supplierProducts.filter(sp => sp.part === part.id);
    supplierProductsForPart.push(newSupplierProduct(part.id));
    return supplierProductsForPart.map((supplierProduct, supplierProductIndex) => {
      const rowKey = getModelKey(supplierProduct);
      return (
        <div className="grid-row" key={`partRow${rowKey}`}>
          <EditModelRow
            model={part}
            modelFields={partFieldsComplete}
            persistedModel={persistedPart}
            sections={sections}
            brands={brands}
            onChange={this.handleInputChange}
            childModels={supplierProducts}
            lockFirstColumn
            actionsRequired
            modelSave={savePart}
            modelDelete={deletePart}
            modelReset={this.resetPart}
            dummyRow={supplierProductIndex > 0}
          />
          <SupplierProductEditRow
            supplierProduct={supplierProduct}
            suppliers={suppliers}
            saveSupplierProduct={saveSupplierProduct}
            deleteSupplierProduct={deleteSupplierProduct}
          />
        </div>
      );
    });
  }
}
SupplierProductReviewPart.propTypes = {
  part: PropTypes.object.isRequired,
  supplierProducts: PropTypes.array,
  brands: PropTypes.array,
  sections: PropTypes.array,
  suppliers: PropTypes.array,
  savePart: PropTypes.func,
  deletePart: PropTypes.func,
  saveSupplierProduct: PropTypes.func,
  deleteSupplierProduct: PropTypes.func,
};
export default SupplierProductReviewPart;
