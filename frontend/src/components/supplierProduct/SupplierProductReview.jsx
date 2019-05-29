import React, { Fragment } from 'react';
import {doWeHaveObjects, removeKey, updateObject} from '../../helpers/utils';
import { Button, Dimmer, Loader } from 'semantic-ui-react';
import SupplierProductReviewListSelection from './SupplierProductReviewListSelection';
import { filterPartsAndProducts } from './helpers/filterPartsAndProducts';
import SupplierProductReviewList from './SupplierProductReviewList';
import { supplierProductSearchFields } from './helpers/search';

const initialState = { listParts: false };
class SupplierProductReview extends React.Component {
  state = updateObject(initialState, {
    searchFields: supplierProductSearchFields(
      this.props.sections,
      this.props.brands,
      this.props.suppliers,
    ),
  });
  handleInputChange = (fieldName, input) => {
    let newState = updateObject(this.state);
    newState[fieldName] = input;
    this.setState(newState);
  };
  handleInputClear = fieldName => {
    this.setState(removeKey(this.state, fieldName));
  };
  buildSearchCriteria = () => {
    const { brand, supplier, partName, standard, stocked } = this.state;
    return { brand, supplier, partName, standard, stocked };
  };
  hasSelectionCriteria = () => {
    const { brand, supplier, partName, partType } = this.state;
    return !!(brand || supplier || partName || doWeHaveObjects(partType));
  };

  listParts = () => {
    const { searchFields } = this.state;
    let { parts, supplierProducts } = this.props;
    const searchCriteria = this.getSearchCriteria();
    const filteredLists = filterPartsAndProducts(
      searchFields,
      searchCriteria,
      parts,
      supplierProducts,
    );
    if (filteredLists.parts.length === 0) {
      this.props.addMessage('No matching parts', 'W');
    } else {
      this.setState({ listParts: true });
    }
  };
  getSearchCriteria = () => {
    const {
      partTypeSelected,
      brandSelected,
      searchPartName,
      searchStandard,
      searchStocked,
      supplierSelected,
    } = this.state;
    const searchCriteria = {
      partTypeSelected,
      brandSelected,
      searchPartName,
      searchStandard,
      searchStocked,
      supplierSelected,
    };
    return searchCriteria;
  };

  showSearch = () => {
    this.setState(initialState);
  };

  render() {
    const { searchFields, listParts } = this.state;
    const {
      isLoading,
      parts,
      supplierProducts,
      brands,
      suppliers,
      sections,
      savePart,
      deletePart,
      saveSupplierProduct,
      deleteSupplierProduct,
    } = this.props;
    let partsToUse, supplierProductsToUse;
    if (listParts) {
      const filteredLists = filterPartsAndProducts(
        searchFields,
        this.getSearchCriteria(),
        parts,
        supplierProducts,
      );
      partsToUse = filteredLists.parts;
      supplierProductsToUse = filteredLists.supplierProducts;
    }
    return (
      <Fragment key="productReview">
        {listParts ? (
          <Fragment>
            <h2>Review Parts</h2>

            <div className="row full align_right">
              <Button key="newSearch" onClick={this.showSearch}>
                New Search
              </Button>
            </div>
            <SupplierProductReviewList
              parts={partsToUse}
              supplierProducts={supplierProductsToUse}
              brands={brands}
              suppliers={suppliers}
              sections={sections}
              savePart={savePart}
              deletePart={deletePart}
              saveSupplierProduct={saveSupplierProduct}
              deleteSupplierProduct={deleteSupplierProduct}
            />
          </Fragment>
        ) : (
          <SupplierProductReviewListSelection
            searchFields={searchFields}
            searchCriteria={this.getSearchCriteria()}
            onChange={this.handleInputChange}
            listParts={this.listParts}
            hasSelectionCriteria={this.hasSelectionCriteria()}
          />
        )}
        {isLoading && (
          <Dimmer active inverted>
            <Loader content="Loading" />
          </Dimmer>
        )}
      </Fragment>
    );
  }
}

export default SupplierProductReview;
