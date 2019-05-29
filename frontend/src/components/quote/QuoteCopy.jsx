import React from 'react'
import {Button, Dimmer, Loader} from 'semantic-ui-react'
import {Redirect} from "react-router";
import {findObjectWithId, removeKey, updateObject, updateObjectInArray} from "../../helpers/utils";
import * as PropTypes from "prop-types";
import CustomerListAndSelect from "../customer/CustomerListAndSelect";
import BikeListAndSelect from "../bike/BikeListAndSelect";
import {quoteDescription} from "./helpers/quote";
import QuoteSummary from "./QuoteSummary";
const defaultState = (props) => {
        const { quotes, quoteId, customers, bikes } = props;
        let quote;
        if (quoteId) {
            quote = findObjectWithId(quotes, quoteId);
            const { customer, bike } = quote;
            const existingCustomer = findObjectWithId(customers, customer);
            let existingBike;
            if (bike) existingBike = findObjectWithId(bikes, bike);
            return {
                selectedCustomer: customer, selectedBike: bike,
                existingCustomer, existingBike,
                brand: '',
                frameName: '',
                archived: false,
            };
        }
        return {};
    };

class QuoteCopy extends React.Component {

    state = defaultState(this.props);

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ redirect: '/customer' });
    };

    handleInputChange = (fieldName, input) => {
        let newState = updateObject(this.state);
        newState[fieldName] = input;
        this.setState(newState);
    };
    handleInputClear = (fieldName) => {
        removeKey(this.state, fieldName);
    };
    buildBikeSearchCriteria = () => {
        const { brand, frameName, archived } = this.state;
        return { brand, frameName, archived };
    };
    getFrameList = () => {
        this.props.getFrameList(this.buildBikeSearchCriteria());
    };
    copyQuote = () => {
        const { selectedCustomer, selectedBike, existingCustomer, existingBike } = this.state;
        const fullCustomers = updateObjectInArray(this.props.customers, existingCustomer);
        const fullBikes = existingBike ? updateObjectInArray(this.props.bikes, existingBike) : this.props.bikes;
        const quote_desc = quoteDescription(selectedCustomer, selectedBike, fullCustomers, this.props.frames, fullBikes, this.props.brands);
        this.props.copyQuote(this.props.quoteId, { customer: selectedCustomer, bike: selectedBike, quote_desc });
    };

    render() {
        const {
            getCustomerList, searchParams, isLoading, customers, count, next,
            brands, bikes, frames,
            quotes, quoteId, quoteParts, bikeParts,
            sections, parts, users
        } = this.props;
        let quote;
        if (quoteId) quote = findObjectWithId(quotes, quoteId);

        const { selectedBike, selectedCustomer, brand, frameName, archived, existingCustomer, existingBike } = this.state;
        if (!quote) return <Redirect to="/quote-list" push/>;
        const copyAllowed = (selectedCustomer && (!quote.bike || (quote.bike && selectedBike)));
        const fullCustomers = updateObjectInArray(customers, existingCustomer);
        const fullBikes = existingBike ? updateObjectInArray(bikes, existingBike) : bikes;
        return (
            <div className='row'>
                <div key="copy-quote" className="grid-container">
                    <h1 data-test="page-header">Copy Quote</h1>
                    <CustomerListAndSelect
                        addNewCustomer={this.goToAddCustomer}
                        getCustomerList={getCustomerList}
                        selectCustomer={this.handleInputChange}
                        searchParams={searchParams}
                        isLoading={isLoading}
                        customers={fullCustomers}
                        count={count}
                        next={next}
                        selectedCustomer={selectedCustomer}
                        data-test="select-customer"
                    />
                    {quote.bike && <BikeListAndSelect
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClear}
                        getFrameList={this.getFrameList}
                        brands={brands}
                        bikes={fullBikes}
                        frames={frames}
                        brandSelected={brand}
                        frameName={frameName}
                        canSelectArchived={true}
                        archived={archived}
                        selectedBike={selectedBike}
                        data-test="select-bike"
                    />}
                    <Button
                        disabled={!copyAllowed}
                        onClick={this.copyQuote}
                        data-test="copy-button"
                    >
                        Copy Quote
                    </Button>
                    {isLoading &&
                    <Dimmer active inverted>
                        <Loader content='Loading'/>
                    </Dimmer>
                    }
                </div>
                <QuoteSummary
                    showPrices={true}
                    quote={quote}
                    quoteParts={quoteParts}
                    brands={brands}
                    sections={sections}
                    parts={parts}
                    bikeParts={bikeParts}
                    bikes={[existingBike]}
                    customers={[existingCustomer]}
                    frames={frames}
                    users={users}
                />
            </div>
        )
    }
}

QuoteCopy.defaultProps = {
    bikes: [],
    suppliers: [],
    frames: [],
    customers: [],
    brands: [],
    quotes: [],
    isLoading: false,
};
QuoteCopy.propTypes = {
    getCustomerList: PropTypes.func.isRequired,
    copyQuote: PropTypes.func.isRequired,
    getFrameList: PropTypes.func.isRequired,
    searchParams: PropTypes.object,
    isLoading: PropTypes.bool,
    customers: PropTypes.array,
    bikes: PropTypes.array,
    brands: PropTypes.array,
    frames: PropTypes.array,
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    next: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    bikeParts: PropTypes.array,
    suppliers: PropTypes.array,
    quotes: PropTypes.array,
    quoteParts: PropTypes.array,
    parts: PropTypes.array,
    sections: PropTypes.array,
    users: PropTypes.array,
    quoteId: PropTypes.number,
};
export default QuoteCopy;