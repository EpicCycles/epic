/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import * as PropTypes from 'prop-types';

import { updateObject } from '../../helpers/utils';
import CustomerListAndSelect from '../customer/CustomerListAndSelect';
import BikeListAndSelect from '../bike/BikeListAndSelect';
import FormCheckbox from '../../common/FormCheckbox';
import SearchButton from '../../common/SearchButton';
import FormTextInput from '../../common/FormTextInput';

class QuoteFind extends React.Component {
  state = {
    quoteDesc: '',
    brand: '',
    frameName: '',
    selectedCustomer: '',
    bike: '',
    archived: false,
  };

  goToAddCustomer = () => {
    this.props.clearCustomerState();
    this.setState({ redirect: '/customer' });
  };

  handleInputChange = (fieldName, input) => {
    const newState = updateObject(this.state);
    newState[fieldName] = input;
    this.setState(newState);
  };

  checkCriteriaForQuoteSearch = () => {
    if (this.state.quoteDesc) return true;
    if (this.state.bike) return true;
    if (this.state.brand) return true;
    if (this.state.frameName) return true;
    if (this.state.selectedCustomer) return true;
    return false;
  };

  getQuoteList = () => {
    const { quoteDesc, brand, frameName, selectedCustomer, bike, archived } = this.state;
    this.props.getQuoteList({ quoteDesc, brand, frameName, selectedCustomer, bike, archived });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter' && this.checkCriteriaForQuoteSearch()) {
      this.getQuoteList();
    }
  };

  render() {
    const { quoteDesc, brand, frameName, selectedCustomer, bike, archived } = this.state;
    const {
      brands,
      bikes,
      frames,
      getFrameList,
      getCustomerList,
      searchParams,
      isLoading,
      customers,
      count,
      next,
    } = this.props;

    return (
      <Fragment>
        <h1>Find Quotes</h1>
        <div className="row vertical-middle" data-test="quoteDescription">
          <div>Quote Description includes:</div>
          <FormTextInput
            data-test="quote-desc-input"
            fieldName="quoteDesc"
            value={quoteDesc}
            onChange={this.handleInputChange}
            onClick={this.handleInputClear}
            onKeyPress={this.handleKeyPress}
          />
          <FormCheckbox
            onChange={this.handleInputChange}
            fieldName="archived"
            fieldValue={archived}
            fieldLabel="Include archived quotes:"
            data-test="archived-checkbox"
            key="select-archived-for-quotes"
          />
        </div>
        <CustomerListAndSelect
          addNewCustomer={this.goToAddCustomer}
          getCustomerList={getCustomerList}
          selectCustomer={this.handleInputChange}
          selectedCustomer={selectedCustomer}
          searchParams={searchParams}
          isLoading={isLoading}
          customers={customers}
          count={count}
          next={next}
          data-test="customer-select"
        />
        <BikeListAndSelect
          brands={brands}
          bikes={bikes}
          frames={frames}
          frameName={frameName}
          brandSelected={brand}
          onChange={this.handleInputChange}
          onClick={this.handleInputChange}
          getFrameList={getFrameList}
          selectedBike={bike}
          data-test="bike-select"
          onKeyPress={this.handleKeyPress}
        />
        <hr />
        <h2>Search</h2>
        <div className="row align-right">
          <SearchButton
            onClick={this.getQuoteList}
            disabled={!this.checkCriteriaForQuoteSearch()}
            title="find matching quotes"
            data-test="search"
            className="big"
          />
        </div>
      </Fragment>
    );
  }
}
QuoteFind.defaultProps = {
  bikes: [],
  frames: [],
  customers: [],
  brands: [],
  isLoading: false,
};
QuoteFind.propTypes = {
  bikes: PropTypes.array,
  brands: PropTypes.array,
  frames: PropTypes.array,
  customers: PropTypes.array,
  searchParams: PropTypes.object,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  next: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getFrameList: PropTypes.func.isRequired,
  getCustomerList: PropTypes.func.isRequired,
  clearCustomerState: PropTypes.func.isRequired,
  getQuoteList: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
export default QuoteFind;
