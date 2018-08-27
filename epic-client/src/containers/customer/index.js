import {connect} from 'react-redux'
import CustomerList from "./CustomerList";
import {getCustomer, getCustomerList, getCustomerListPage, clearCustomerState} from "../../state/actions/customer";

export default connect(({customer}) => ({
    count: customer.customers.length,
    customers: customer.customers.slice(((customer.page - 1) * customer.perPage), (customer.page * customer.perPage)),
    isLoading: customer.isLoading,
    searchParams: customer.searchParams,
    page: customer.page,
    totalPages: customer.totalPages
}), {
    getCustomerList,
    getCustomerListPage,
    getCustomer,
    clearCustomerState
})(CustomerList)

