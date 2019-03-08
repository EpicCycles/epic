import React, {Fragment} from 'react'
import CustomerList from "../customer/CustomerList";

const initialState = {
    mode: 'find',
};
class QuoteCustomer extends React.Component {
    state = initialState;

    render() {
            const { mode } = this.state;
        const { searchParams, getCustomerList, getCustomerListPage, getCustomer, removeCustomerError, clearCustomerState, isLoading, customers, count, next, previous, error } = this.props;
    return <Fragment>
            <h1>Customer</h1>
            {(mode === 'find') && <CustomerList
                searchParams={searchParams}
                getCustomerList={getCustomerList}
                getCustomerListPage={getCustomerListPage}
                getCustomer={getCustomer}
            />}
        </Fragment>
    }
}