import {connect} from 'react-redux'
import CustomerList from "../../components/customer/CustomerList";
import {getCustomer, getCustomerList, getCustomerListPage, clearCustomerState} from "../../state/actions/customer";

export default connect(({customer}) => ({
    count: customer.count,
    customers: customer.customers,
    next: customer.next,
    previous: customer.previous,
    isLoading: customer.isLoading,
    searchParams: customer.searchParams,
}), {
    getCustomerList,
    getCustomerListPage,
    getCustomer,
    clearCustomerState
})(CustomerList)

