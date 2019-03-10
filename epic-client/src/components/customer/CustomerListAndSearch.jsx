import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {searchParams} from "../../state/selectors/customer";
import CustomerSearch from "./CustomerSearch";
import CustomerListGridHeaders from "./CustomerListGridHeaders";
import CustomerListGridRow from "./CustomerListGridRow";
import Pagination from "../../common/pagination";
import CustomerAddLink from "./CustomerAddLink";

const CustomerListAndSearch = (props) => {
    const { addNewCustomer, getCustomerList, getCustomerListPage, getCustomer, isLoading, customers, count, next, previous } = props;
    return <Fragment>
        <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} isLoading={isLoading}/>
        {count > 0 &&
        <div
            className="grid-container"
            key="customer-list-container"
            style={{ width: '100%', height: '400px' }}
        >
            <CustomerListGridHeaders
                lockFirstColumn={true}
                includeActions={true}
            />
            {customers.map(customer =>
                <CustomerListGridRow
                    key={`cust-${customer.id}`}
                    customer={customer}
                    getCustomer={getCustomer}
                    lockFirstColumn={true}
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
    count: PropTypes.number,
    next: PropTypes.number,
    previous: PropTypes.number,
};
export default CustomerListAndSearch;