/* eslint-disable camelcase */
import React from 'react';

import * as PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { NEW_ELEMENT_ID } from '../../helpers/constants';
import { brandFields, supplierFields } from '../app/model/helpers/fields';
import EditModelPage from '../app/model/EditModelPage';
import { checkForChangesAllFields, getModelKey, updateModel } from '../app/model/helpers/model';
import { updateObject } from '../../helpers/utils';
import { getSupplierNamesForBrand } from './helpers/brand';
import ModelEditIcons from '../app/model/ModelEditIcons';

class BrandModal extends React.Component {
  state = {
    brand: updateObject(this.props.brand),
    persistedBrand: this.props.brand,
    mode: this.props.brand && this.props.brand.id ? 'Edit' : 'New',
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current brand changes,
    // Reset any parts of state that are tied to that brand.
    // In this simple example, that's just the email.
    if (checkForChangesAllFields(brandFields, props.brand, state.persistedBrand)) {
      return {
        brand: updateObject(props.brand),
        persistedBrand: props.brand,
        mode: props.brand && props.brand.id ? 'Edit' : 'New',
      };
    }
    return null;
  }
  handleBrandValueChange = (fieldName, input) => {
    let { brand } = this.state;

    brand = updateModel(brand, brandFields, fieldName, input);
    this.setState({ brand });
  };

  onClickReset = () => {
    const { persistedBrand } = this.state;
    const brand = updateObject(persistedBrand);
    this.setState({ brand });
  };

  saveOrCreateBrand = () => {
    const { saveBrand, closeBrandModal } = this.props;
    const { brand } = this.state;
    saveBrand(brand);
    closeBrandModal();
  };

  deleteOrRemoveBrand = () => {
    const { deleteBrand, closeBrandModal } = this.props;
    const { brand } = this.state;
    deleteBrand(brand);
    closeBrandModal();
  };

  render() {
    const { brand, persistedBrand, mode } = this.state;
    const componentKey = getModelKey(brand);
    const { closeBrandModal, suppliers, deleteBrand } = this.props;
    return (
      <div>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <Icon name="remove" circular link onClick={closeBrandModal} />
        </div>
        <div style={{ width: '100%', textAlign: 'left' }}>
          <h2>{mode} Brand</h2>
          <EditModelPage
            model={brand}
            persistedModel={persistedBrand}
            modelFields={brandFields}
            onChange={this.handleBrandValueChange}
            suppliers={suppliers}
          />
        </div>
        <div className="align_right">
          <ModelEditIcons
            componentKey={componentKey}
            model={brand}
            modelSave={this.saveOrCreateBrand}
            modelDelete={this.deleteOrRemoveBrand}
            modelReset={this.onClickReset}
          />
        </div>
      </div>
    );
  }
}

BrandModal.propTypes = {
  brandModalOpen: PropTypes.bool.isRequired,
  brand: PropTypes.object.isRequired,
  componentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suppliers: PropTypes.array.isRequired,
  saveBrand: PropTypes.func.isRequired,
  deleteBrand: PropTypes.func.isRequired,
  closeBrandModal: PropTypes.func.isRequired,
};

export default BrandModal;
