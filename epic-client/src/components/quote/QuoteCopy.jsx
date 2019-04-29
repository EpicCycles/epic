import React from 'react'
import {Button, Dimmer, Loader} from 'semantic-ui-react'
import {Redirect} from "react-router-dom";
import {findObjectWithId, removeKey, updateObject} from "../../helpers/utils";
import * as PropTypes from "prop-types";
import CustomerListAndSelect from "../customer/CustomerListAndSelect";
import BikeListAndSelect from "../bike/BikeListAndSelect";
import {quoteDescription} from "./helpers/quote";
import QuoteSummary from "./QuoteSummary";

const initialState = {
    brand: '',
    frameName: '',
    archived: false,
};

class QuoteCopy extends React.Component {
    state = initialState;

    componentDidMount() {
        this.setState(this.defaultState());
    }

    defaultState = () => {
        const { quotes, quoteId } = this.props;
        let quote;
        if (quoteId) quote = findObjectWithId(quotes, quoteId);
        const { customer, bike } = quote;
        return { customer, bike };
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
        const customer = this.state.customer;
        const bike = this.state.bike;
        const quote_desc = quoteDescription(customer, bike, this.props.customers, this.props.frames, this.props.bikes, this.props.brands);
        this.props.copyQuote(this.props.quoteId, { customer, bike, quote_desc });
    };

    render() {
        const { getCustomerList, searchParams, isLoading, customers, count, next,
            brands, bikes, frames,
            quotes, quoteId, quoteParts, bikeParts,
            sections, parts
        } = this.props;
        let quote;
        if (quoteId) quote = findObjectWithId(quotes, quoteId);

        const { bike, customer, brand, frameName, archived } = this.state;
        if (! quote) return <Redirect to="/quote-list" push/>;
        const copyAllowed = (customer && ( ! quote.bike || (quote.bike && bike)) );
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
                        customers={customers}
                        count={count}
                        next={next}
                        selectedCustomer={customer}
                        data-test="select-customer"
                    />
                    {quote.bike && <BikeListAndSelect
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClear}
                        getFrameList={this.getFrameList}
                        brands={brands}
                        bikes={bikes}
                        frames={frames}
                        brandSelected={brand}
                        frameName={frameName}
                        canSelectArchived={true}
                        archived={archived}
                        selectedBike={bike}
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
                    bikes={bikes}
                    customers={customers}
                    frames={frames}
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
    quoteId: PropTypes.number,
};
export default QuoteCopy;