import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';
import { updateObject } from '../../helpers/utils';
import { checkForChangesAllFields, getModelKey, updateModel } from '../app/model/helpers/model';
import { supplierFields } from '../app/model/helpers/fields';
import EditModelPage from '../app/model/EditModelPage';
import ModelEditIcons from '../app/model/ModelEditIcons';
import * as PropTypes from 'prop-types';
import { getBrandsForSupplier } from './helpers/supplier';

class SupplierEdit extends React.Component {
  state = {
    supplier: updateObject(this.props.supplier),
    persistedSupplier: this.props.supplier,
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (checkForChangesAllFields(supplierFields, props.supplier, state.persistedSupplier)) {
      return {
        supplier: updateObject(props.supplier),
        persistedSupplier: props.supplier,
      };
    }
    return null;
  }

  handleInputChange = (fieldName, input) => {
    let { supplier } = this.state;
    supplier = updateModel(supplier, supplierFields, fieldName, input);
    this.setState({ supplier });
  };

  onClickReset = () => {
    const { persistedSupplier } = this.state;
    const supplier = updateObject(persistedSupplier);
    this.setState({ supplier });
  };

  saveOrCreateSupplier = () => {
    let { supplier } = this.state;
    this.props.saveSupplier(supplier);
    if (this.props.closeModal) {
      this.props.closeModal();
    }
  };
  deleteOrRemoveSupplier = () => {
    let { supplier } = this.state;
    if (supplier && supplier.id) {
      this.props.deleteSupplier(supplier.id);
    }
    this.setState({ supplier: {}, persistedSupplier: {} });
    if (this.props.closeModal) {
      this.props.closeModal();
    }
  };

  render() {
    const { supplier, persistedSupplier } = this.state;
    const { closeModal, brands } = this.props;
    const componentKey = getModelKey(supplier);
    const brandNames = getBrandsForSupplier(componentKey, brands);
    return (
      <Fragment>
        {closeModal && (
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Icon name="remove" circular link onClick={closeModal} />
          </div>
        )}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <h2>Edit Supplier</h2>
          <EditModelPage
            model={supplier}
            persistedModel={persistedSupplier}
            modelFields={supplierFields}
            onChange={this.handleInputChange}
            showReadOnlyFields
          />
          <div key={`supplierBrands${componentKey}`}>Brands: {brandNames.join(', ')}</div>
          <div className="align_right">
            <ModelEditIcons
              componentKey={componentKey}
              model={supplier}
              modelSave={this.saveOrCreateSupplier}
              modelDelete={this.deleteOrRemoveSupplier}
              modelReset={this.onClickReset}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
SupplierEdit.defaultProps = {
  brands: [],
  supplier: {},
};
SupplierEdit.propTypes = {
  brands: PropTypes.array,
  supplier: PropTypes.object,
  componentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteSupplier: PropTypes.func,
  saveSupplier: PropTypes.func,
  closeModal: PropTypes.func,
};
export default SupplierEdit;
