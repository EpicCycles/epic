import React from 'react'
import {Button, Dimmer, Loader} from 'semantic-ui-react'
import {Redirect} from "react-router-dom";
import {findObjectWithId, removeKey, updateObject} from "../../helpers/utils";
import * as PropTypes from "prop-types";
import CustomerListAndSelect from "../customer/CustomerListAndSelect";
import BikeListAndSelect from "../bike/BikeListAndSelect";
import {quoteDescription} from "./helpers/quote";
import {CUSTOMER_URL} from "../menus/helpers/menu";

const initialState = {
    brand: '',
    frameName: '',
    archived: false,
};

class QuoteCreate extends React.Component {
    state = initialState;

    componentDidMount() {
        this.setState(updateObject(initialState, {
            selectedCustomer: this.props.customerId,
            selectedBike: this.props.bikeId
        }));
    }

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ redirect: CUSTOMER_URL });
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
    buildQuote = () => {
        const customer = this.state.selectedCustomer;
        const bike = this.state.selectedBike;
        let quote = this.quoteStart(customer, bike);
        this.props.createQuote(quote);
    };

    quoteStart(customer, bike) {
        const quote_desc = quoteDescription(customer, bike, this.props.customers, this.props.frames, this.props.bikes, this.props.brands);
        let quote = { customer, bike, quote_desc };

        const customerObject = findObjectWithId(this.props.customers, customer);
        if (customerObject) quote.club_member = customerObject.club_member;

        let bikeObject;
        if (bike) {
            bikeObject = findObjectWithId(this.props.bikes, bike);
            if (bikeObject) quote.bike_price = (quote.club_member && bikeObject.club_price) ? bikeObject.club_price : bikeObject.epic_price ? bikeObject.epic_price : bikeObject.rrp;
            quote.quote_price = quote.bike_price;
        }
        return quote;
    }

    render() {
        const { redirect } = this.state;
        const { getCustomerList, searchParams, isLoading, customers, count, next, brands, bikes, frames } = this.props;
        const { selectedBike, selectedCustomer, brand, frameName, archived } = this.state;
        if (redirect) return <Redirect to={redirect} push/>;

        return (
            <div key="create-quote" className="grid-container">
                <h1 data-test="page-header">Create Quote</h1>
                <CustomerListAndSelect
                    addNewCustomer={this.goToAddCustomer}
                    getCustomerList={getCustomerList}
                    selectCustomer={this.handleInputChange}
                    searchParams={searchParams}
                    isLoading={isLoading}
                    customers={customers}
                    count={count}
                    next={next}
                    selectedCustomer={selectedCustomer}
                    data-test="select-customer"
                />
                <BikeListAndSelect
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
                    selectedBike={selectedBike}
                    data-test="select-bike"
                />
                <Button
                    disabled={!selectedCustomer}
                    onClick={this.buildQuote}
                    data-test="create-button"
                >
                    Create Quote
                </Button>
                {isLoading &&
                <Dimmer active inverted>
                    <Loader content='Loading'/>
                </Dimmer>
                }
            </div>
        )
    }
}

QuoteCreate.propTypes = {
    getCustomerList: PropTypes.func.isRequired,
    createQuote: PropTypes.func.isRequired,
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
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    bikeId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
export default QuoteCreate;