import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import Pagination from "../../common/pagination";
import {Redirect} from "react-router-dom";
import CustomerAddLink from "./CustomerAddLink";
import CustomerSearch from "./CustomerSearch";
import {searchParams} from "../../state/selectors/customer";
import CustomerListGridHeaders from "./CustomerListGridHeaders";
import CustomerListGridRow from "./CustomerListGridRow";
import CustomerListAndSearch from "./CustomerListAndSearch";


class CustomerList extends React.Component {
    state = {};

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ redirect: '/customer' });
    };

    render() {
        const { redirect } = this.state;
        const { getCustomerList, getCustomerListPage, getCustomer, isLoading, customers, count, next, previous, searchParams } = this.props;
        if (redirect) return <Redirect to={redirect}/>;

        return (
            <div id="customer-list" className="grid-container">
                <CustomerListAndSearch
                    addNewCustomer={this.goToAddCustomer}
                    getCustomerList={getCustomerList}
                    getCustomerListPage={getCustomerListPage}
                    getCustomer={getCustomer}
                    searchParams={searchParams}
                    isLoading={isLoading}
                    customers={customers}
                    count={count}
                    next={next}
                    previous={previous}
                />
                {isLoading &&
                <Dimmer active inverted>
                    <Loader content='Loading'/>
                </Dimmer>
                }
            </div>
        )
    }
}

export default CustomerList;