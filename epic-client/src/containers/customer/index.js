import {connect} from 'react-redux'
import CustomerList from "./CustomerList";
import {getCustomer, getCustomerList, getCustomerListPage, removeCustomerError} from "../../state/actions/customer";

export default connect(({customer}) => ({
    count: customer.customers.length,
    customers: customer.customers.slice(((customer.page - 1) * customer.perPage), (customer.page * customer.perPage)),
    isLoading: customer.isLoading,
    searchFirstName: customer.searchFirstName,
    searchLastName: customer.searchLastName,
    searchEmail: customer.searchEmail,
    page: customer.page,
    totalPages: customer.totalPages,
    error: customer.error
}), {
    getCustomerList,
    getCustomerListPage,
    getCustomer,
    removeCustomerError
})(CustomerList)

