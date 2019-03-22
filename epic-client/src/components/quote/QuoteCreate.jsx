import React from 'react'
import {Button, Dimmer, Loader} from 'semantic-ui-react'
import {Redirect} from "react-router-dom";
import {findObjectWithId, removeKey, updateObject} from "../../helpers/utils";
import * as PropTypes from "prop-types";
import CustomerListAndSelect from "../customer/CustomerListAndSelect";
import BikeListAndSelect from "../bike/BikeListAndSelect";
import {bikeFullName} from "../bike/helpers/bike";
import {recalculatePrices} from "./helpers/quote";

class QuoteCreate extends React.Component {
    state = {
        brand: '',
        frameName: '',
        archived: false,
    };

    componentDidMount() {
        this.setState(updateObject(initialState, {
            selectedCustomer: this.props.customerId,
            selectedBike: this.props.bikeId
        }));
    }

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
    buildQuote = () => {
        const customer = this.state.selectedCustomer;
        const bike = this.state.selectedBike;
        let quote = { customer, bike };
        let quote_desc;
        let bikeObject;
        if (bike) {
            bikeObject = findObjectWithId(this.props.bikes, bike);
        }
        if (bikeObject) {
            quote_desc = bikeFullName(bikeObject, this.props.frames, this.props.brands);
        } else {
            quote_desc = 'Parts only'
        }
        quote_desc += ` ${Date.now().toUTCString()}`;
        quote.quote_desc = quote_desc;
        quote = recalculatePrices(quote, [], bikeObject);
        this.props.createQuote(quote);
        this.setState({ redirect: '/quote-create' })
    };

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
                />
                <Button
                    disabled={!selectedCustomer}
                    onClick={this.buildQuote}
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