import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {searchParams} from "../../state/selectors/customer";
import CustomerSearch from "./CustomerSearch";
import CustomerListGridHeaders from "./CustomerListGridHeaders";
import CustomerListGridRow from "./CustomerListGridRow";
import Pagination from "../../common/pagination";
import CustomerAddLink from "./CustomerAddLink";

const CustomerListAndSearch = (props) => {
    const { addNewCustomer, getCustomerList, getCustomerListPage, getCustomer, isLoading, customers, count, next, previous, searchParams } = props;
    return <Fragment>
        <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} isLoading={isLoading}/>
        {count > 0 &&
        <div
            className="grid"
            key="customer-list-container"
        >
            <CustomerListGridHeaders
                includeActions={true}
            />
            {customers.map(customer =>
                <CustomerListGridRow
                    key={`cust-${customer.id}`}
                    customer={customer}
                    getCustomer={getCustomer}
                />
            )}
        </div>
        }
        <div className="row align-left">
            {count > 0 ? <Pagination
                    id="customer-pagination"
                    previous={previous}
                    next={next}
                    count={count}
                    getPage={getCustomerListPage}/>
                :
                <div>
                    No Customer to show, set new criteria and search, or
                </div>
            }
            <CustomerAddLink addNewCustomer={addNewCustomer}/>
        </div>
    </Fragment>;
};
CustomerListAndSearch.defaultProps = {
    count: 0,
};
CustomerListAndSearch.propTypes = {
    addNewCustomer: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    getCustomerListPage: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
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
    previous: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
export default CustomerListAndSearch;