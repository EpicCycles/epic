import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import CustomerSearch from "./CustomerSearch";
import CustomerAddLink from "./CustomerAddLink";
import {getModelKey} from "../app/model/helpers/model";
import {buildCustomerString} from "./helpers/customer";
import SelectInput from "../../common/SelectInput";

const CustomerListAndSelect = (props) => {
    const { addNewCustomer, getCustomerList, selectCustomer, isLoading, customers, count, next, searchParams, selectedCustomer } = props;
    const customerOptions = customers ? customers.map(customer => {
        return {
            value: String(getModelKey(customer)),
            name: buildCustomerString(customer)
        }
    }) : [];
    return <Fragment>
        <h2 data-test="list-and-search-heading">Select Customer</h2>
        <CustomerSearch
            getCustomerList={getCustomerList}
            searchParams={searchParams}
            isLoading={isLoading}
            data-test="search-block"
        />
        {count > 0 && <SelectInput
            title={'Select Customer'}
            label={'Select Customer'}
            onChange={selectCustomer}
            value={selectedCustomer}
            options={customerOptions}
            data-test="customer-block"
            fieldName='selectedCustomer'
        />
        }
        <div className="row align-left">
            {count === 0 &&
            <div data-test="start-message">
                No Customer to show, set new criteria and search, or
            </div>
            }
            {next &&
            <div data-test="search-message">
                Not all customers matching are shown, refine criteria and search, or
            </div>
            }
            <CustomerAddLink addNewCustomer={addNewCustomer}/>
        </div>
    </Fragment>;
};
CustomerListAndSelect.defaultProps = {
    count: 0,
};
CustomerListAndSelect.propTypes = {
    addNewCustomer: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    selectCustomer: PropTypes.func.isRequired,
    searchParams: PropTypes.object,
    isLoading: PropTypes.bool,
    customers: PropTypes.array,
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    next: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    selectedCustomer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
export default CustomerListAndSelect;