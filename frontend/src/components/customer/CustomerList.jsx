import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import {Redirect} from "react-router-dom";
import CustomerListAndSearch from "./CustomerListAndSearch";
import {CUSTOMER_URL} from "../menus/helpers/menu";

class CustomerList extends React.Component {
    state = {};

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ redirect: CUSTOMER_URL });
    };

    goToEditCustomer = (customerId) => {
        this.props.getCustomer(customerId);
        this.setState({ redirect: CUSTOMER_URL });
    };

    render() {
        const { redirect } = this.state;
        const { getCustomerList, getCustomerListPage, isLoading, customers, count, next, previous, searchParams } = this.props;
        if (redirect) return <Redirect to={redirect} push />;

        return (
            <div id="customer-list" className="grid-container">
                <CustomerListAndSearch
                    addNewCustomer={this.goToAddCustomer}
                    getCustomerList={getCustomerList}
                    getCustomerListPage={getCustomerListPage}
                    getCustomer={this.goToEditCustomer}
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