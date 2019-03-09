import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import Pagination from "../../common/pagination";
import {Redirect} from "react-router-dom";
import CustomerAddLink from "./CustomerAddLink";
import CustomerSearch from "./CustomerSearch";
import {searchParams} from "../../state/selectors/customer";
import CustomerListGridHeaders from "./CustomerListGridHeaders";
import CustomerListGridRow from "./CustomerListGridRow";


class CustomerList extends React.Component {
    state = {};

    goToAddCustomer = () => {
        this.props.clearCustomerState();
        this.setState({ redirect: '/customer' });
    };

    render() {
        const { redirect } = this.state;
        const { getCustomerList, getCustomerListPage, getCustomer, removeCustomerError, isLoading, customers, count, next, previous, error } = this.props;
        if (redirect) return <Redirect to={redirect}/>;

        return (
            <div id="customer-list">
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
                    <CustomerAddLink addNewCustomer={this.goToAddCustomer()}/>
                </div>
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