/* eslint-disable camelcase */
import React from 'react';
import ReactModal from 'react-modal';

import * as PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { NEW_ELEMENT_ID } from '../../helpers/constants';
import { brandFields } from '../app/model/helpers/fields';
import EditModelPage from '../app/model/EditModelPage';
import { updateModel } from '../app/model/helpers/model';

class BrandModal extends React.Component {
  state = {};

  constructor(props) {
    super();
    this.state = this.deriveStateFromProps(props);
  }

  onAfterOpen = () => {
    this.setState(this.deriveStateFromProps(this.props));
  };

  deriveStateFromProps = props => {
    return {
      brand: props.brand || {},
      mode: props.brand && props.brand.id ? 'Edit' : 'New',
    };
  };

  handleBrandValueChange = (fieldName, input) => {
    const { componentKey, brand, suppliers } = this.props;

    const updatedBrand = updateModel(brand, brandFields, fieldName, input);
    if (fieldName.startsWith('supplier')) {
      updatedBrand.supplier_names = this.buildSupplierNameArray(input, suppliers);
    }

    if (componentKey === NEW_ELEMENT_ID) updatedBrand.dummyKey = NEW_ELEMENT_ID;

    this.setState({ brand: updatedBrand });
  };

  buildSupplierNameArray = (selectedSuppliers, suppliers) => {
    const supplier_names = [];
    suppliers.forEach(supplier => {
      if (selectedSuppliers.includes(supplier.id)) {
        supplier_names.push(supplier.supplier_name);
      }
    });
    return supplier_names;
  };

  onClickReset = () => {
    this.setState(this.deriveStateFromProps(this.props));
  };

  saveOrCreateBrand = () => {
    const { saveBrand, closeBrandModal } = this.props;
    const { brand } = this.state;
    saveBrand(brand);
    closeBrandModal();
  };

  deleteOrRemoveBrand = () => {
    const { deleteBrand, closeBrandModal } = this.props;
    const { componentKey, brand } = this.state;
    if (componentKey) {
      deleteBrand(brand);
    }
    closeBrandModal();
  };

  render() {
    const { brand, mode } = this.state;
    const { closeBrandModal, suppliers, brandModalOpen, deleteBrand } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const persistedBrand = this.props.brand;
    return (
      <ReactModal
        isOpen={brandModalOpen}
        contentLabel={`${mode} Brand`}
        className="Modal BrandModal"
        onAfterOpen={this.onAfterOpen}
      >
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
        <div style={{ width: '100%', textAlign: 'right' }}>
          {brand.changed && (
            <Icon
              id="reset-brand"
              name="undo"
              onClick={this.onClickReset}
              title="Reset Brand details"
            />
          )}
          {brand.changed && !brand.error && (
            <Icon
              id="accept-brand"
              name="check"
              onClick={this.saveOrCreateBrand}
              title="Confirm Brand Change"
            />
          )}
          {deleteBrand && (brand.id || brand.changed) && (
            <Icon
              id="delete-brand"
              name="trash"
              onClick={this.deleteOrRemoveBrand}
              title="Delete Brand"
            />
          )}
        </div>
      </ReactModal>
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
