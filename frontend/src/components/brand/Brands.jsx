/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';

import { Button, Dimmer, Loader } from 'semantic-ui-react';
import { Prompt } from 'react-router';
import { addToUniqueArray, findIndexOfObjectWithKey, findObjectWithKey } from '../../helpers/utils';
import { NEW_ELEMENT_ID } from '../../helpers/constants';
import BrandEdit from './BrandEdit';
import SupplierBlob from '../supplier/SupplierBlob';
import { getModelKey } from '../app/model/helpers/model';
import SupplierEdit from '../supplier/SupplierEdit';
const CHANGES_CONFIRM =
  'You have made changes to brands. Cancel and Save if you do not want to lose them.';
class Brands extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleBrandChange = (brandKey, updatedbrand) => {
    const brandsWithUpdates = this.props.brands.slice();
    const brandToUpdateIndex = findIndexOfObjectWithKey(brandsWithUpdates, brandKey);
    if (brandToUpdateIndex > -1) {
      brandsWithUpdates[brandToUpdateIndex] = updatedbrand;
    } else {
      brandsWithUpdates.push(updatedbrand);
    }
    this.props.updateBrands(brandsWithUpdates);
  };

  saveChanges = () => {
    this.props.saveBrands(this.props.brands);
  };

  allowDrop = event => {
    event.preventDefault();
    // Set the dropEffect to move
    event.dataTransfer.dropEffect = 'move';
  };

  pickUpBrand = (event, brandKey) => {
    // Add the target element's id to the data transfer object
    event.dataTransfer.setData('text/plain', brandKey);
    event.dropEffect = 'move';
  };

  assignToSupplier = (event, supplierId) => {
    event.preventDefault();
    const brandKey = event.dataTransfer.getData('text');
    if (brandKey && supplierId) {
      this.addSupplierToBrand(brandKey, supplierId);
    }
  };

  addSupplierToBrand = (brandKey, supplierId) => {
    const brands = this.props.brands;
    const suppliers = this.props.suppliers;
    // Get the id of the target and add the moved element to the target's DOM
    const brandsWithUpdates = brands.slice();
    const brandToUpdateIndex = findIndexOfObjectWithKey(brands, brandKey);
    const supplierIndex = findIndexOfObjectWithKey(suppliers, supplierId);

    if (supplierIndex > -1 && brandToUpdateIndex > -1) {
      brandsWithUpdates[brandToUpdateIndex].supplier = addToUniqueArray(
        brandsWithUpdates[brandToUpdateIndex].supplier,
        suppliers[supplierIndex].id,
      );
      brandsWithUpdates[brandToUpdateIndex].changed = true;
      this.props.updateBrands(brandsWithUpdates);
    }
  };

  handleOpenModal = supplierId => {
    if (supplierId) {
      this.setState({ showModal: true, supplierId });
    } else {
      this.setState({ showModal: true });
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { brands, suppliers, isLoading, saveSupplier, deleteSupplier } = this.props;
    const { showModal, supplierId } = this.state;
    const supplierToEdit = supplierId ? findObjectWithKey(suppliers, supplierId) : {};
    const brandsToUse = brands
      ? brands.filter(brand => !(brand.delete || brand.dummyKey === NEW_ELEMENT_ID))
      : [];
    const suppliersToUse = suppliers
      ? suppliers.filter(supplier => !(supplier.delete || supplier.dummyKey === NEW_ELEMENT_ID))
      : [];
    const brandsWithChanges = brands ? brands.filter(brand => brand.delete || brand.changed) : [];
    const newbrands = brands ? brands.filter(brand => brand.dummyKey === NEW_ELEMENT_ID) : [];
    const newbrandForDisplay = newbrands.length > 0 ? newbrands[0] : {};
    const changesExist = brandsWithChanges.length > 0;
    return (
      <Fragment>
        <Prompt when={changesExist} message={CHANGES_CONFIRM} />
        <section key="brandsAndSuppliers" className="row" id="brandsAndSuppliers">
          <div key="brands">
            <Button
              key="saveBrandsChanges"
              onClick={this.saveChanges}
              disabled={isLoading || !changesExist}
            >
              Save
            </Button>
            {brandsToUse.map(brand => {
              const componentKey = getModelKey(brand);
              return (
                <BrandEdit
                  key={`brandEdit${componentKey}`}
                  brand={brand}
                  suppliers={suppliers}
                  componentKey={componentKey}
                  handleBrandChange={this.handleBrandChange}
                  pickUpBrand={this.pickUpBrand}
                />
              );
            })}
            <BrandEdit
              key={`brandEdit${NEW_ELEMENT_ID}`}
              brand={newbrandForDisplay}
              componentKey={NEW_ELEMENT_ID}
              handleBrandChange={this.handleBrandChange}
              pickUpBrand={this.pickUpBrand}
            />
          </div>
          <div key="suppliers">
            <div>
              {showModal ? (
                <SupplierEdit
                  supplier={supplierToEdit ? supplierToEdit : {}}
                  componentKey={getModelKey(supplierToEdit)}
                  saveSupplier={saveSupplier}
                  deleteSupplier={deleteSupplier}
                  closeModal={this.handleCloseModal}
                  brands={brands}
                />
              ) : (
                <button type="button" onClick={this.handleOpenModal}>
                  Add Supplier
                </button>
              )}
            </div>
            {suppliersToUse &&
              suppliersToUse.map(supplier => {
                const componentKey = getModelKey(supplier);
                return (
                  <div
                    key={`droppablediv${componentKey}`}
                    onDragOver={event => this.allowDrop(event)}
                    onDrop={event => this.assignToSupplier(event, supplier.id)}
                  >
                    <SupplierBlob
                      supplier={supplier}
                      brands={brands}
                      showBrands
                      showWebsite
                      allowEdit
                      editFunction={this.handleOpenModal}
                    />
                  </div>
                );
              })}
          </div>
        </section>
        {isLoading && (
          <Dimmer active inverted>
            <Loader content="Loading" />
          </Dimmer>
        )}
      </Fragment>
    );
  }
}
Brands.propTypes = {
  brands: PropTypes.array,
  suppliers: PropTypes.array,
  isLoading: PropTypes.bool,
  saveSupplier: PropTypes.func,
  deleteSupplier: PropTypes.func,
  updateBrands: PropTypes.func,
  saveBrands: PropTypes.func,
};
export default Brands;
