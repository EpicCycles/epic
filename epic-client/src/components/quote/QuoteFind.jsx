import React, {Fragment} from 'react';
import * as PropTypes from "prop-types";

import {doWeHaveObjects, updateObject} from "../../helpers/utils";
import CustomerListAndSelect from "../customer/CustomerListAndSelect";
import BikeListAndSelect from "../bike/BikeListAndSelect";
import FormCheckbox from "../../common/FormCheckbox";
import SearchButton from "../../common/SearchButton";

class QuoteFind extends React.Component {
    state = {
        brand: '',
        frameName: '',
        customerId: '',
        bike: '',
        archived: false,
    };

    componentDidMount() {
        this.checkPropsData();
    };

    checkPropsData = () => {
        if (!this.props.isLoading) this.getData();
    };
    getData = () => {
        let brandsRequired = true;

        if (doWeHaveObjects(this.props.brands)) brandsRequired = false;

        if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        }

    };

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ redirect: '/customer' });
    };

    handleInputChange = (fieldName, input) => {
        let newState = updateObject(this.state);
        newState[fieldName] = input;
        this.setState(newState);
    };
    checkCriteriaForQuoteSearch = () => {
        if (this.state.bike) return true;
        if (this.state.brand) return true;
        if (this.state.frameName) return true;
        return !!this.state.customerId;
    };
    getQuoteList = () => {
        const { brand, frameName, customerId, bike, archived } = this.state;
        this.props.getQuoteList({ brand, frameName, customerId, bike, archived })
    };

    render() {
        const { brand, frameName, customerId, bike, archived } = this.state;
        const { brands, bikes, frames, getFrameList, getCustomerList, searchParams, isLoading, customers, count, next } = this.props;

        return <Fragment>
                        <h1>Find Quotes</h1>

            <CustomerListAndSelect
                addNewCustomer={this.goToAddCustomer}
                getCustomerList={getCustomerList}
                selectCustomer={this.handleInputChange}
                selectedCustomer={customerId}
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
            />
            <hr/>
            <div className='row'>
                <FormCheckbox
                    onChange={this.handleInputChange}
                    fieldName={'archived'}
                    fieldValue={archived}
                    fieldLabel='Include archived quotes:'
                    data-test="archived-checkbox"
                    key='select-archived-for-quotes'
                />
                <SearchButton
                    onClick={this.getQuoteList}
                    disabled={this.checkCriteriaForQuoteSearch()}
                    title={'find matching quotes'}
                    data-test="search"
                />
            </div>
        </Fragment>
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
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    next: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    getBrandsAndSuppliers: PropTypes.func.isRequired,
    getFrameList: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    clearCustomerState: PropTypes.func.isRequired,
    getQuoteList: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default QuoteFind;
