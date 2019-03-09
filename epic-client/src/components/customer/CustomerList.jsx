import React from 'react'
import {Button, Dimmer, Icon, Loader} from 'semantic-ui-react'
import Pagination from "../../common/pagination";
import FormTextInput from "../../common/FormTextInput";
import CustomerRow from "./CustomerRow";
import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";
import {Redirect} from "react-router-dom";
import CustomerAddLink from "./CustomerAddLink";
import CustomerSearch from "./CustomerSearch";
import {searchParams} from "../../state/selectors/customer";


class CustomerList extends React.Component {
    state = {};

    goToAddCustomer = () => {
        props.clearCustomerState();
        this.setState({ redirect: '/customer' });
    };

    render() {
        const { redirect } = this.state;
        const { getCustomerList, getCustomerListPage, getCustomer, removeCustomerError, isLoading, customers, count, next, previous, error } = this.props;
        if (redirect) return <Redirect to={redirect}/>;

        return (
            <div id="customer-list">
                <CustomerSearch getCustomerList={getCustomerList} searchParams={searchParams} isLoading={isLoading}/>
                {count > 0 ? <div
                    className="grid-container"
                    key="customer-list-container"
                    style={{ width: '100%', height: '400px' }}
                    >
                        <table className="fixed_headers">
                            <thead>
                            <tr>
                                <th className="listHead">First Name</th>
                                <th className="listHead">Last Name</th>
                                <th className="listHead">email</th>
                                <th className="listHead">Date Added</th>
                                <th className="listHead">Date Updated</th>
                                <th className="listHead">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map(customer =>
                                <CustomerRow key={`cust-${customer.id}`} customer={customer} getCustomer={getCustomer}/>
                            )}
                            </tbody>
                        </table>
                        <div className="row align-left">
                            <Pagination
                                id="customer-pagination"
                                previous={previous}
                                next={next}
                                count={count}
                                getPage={getCustomerListPage}/>
                            <CustomerAddLink addNewCustomer={this.goToAddCustomer()}/>
                        </div>
                    </div>
                    :
                    <p>
                        Set criteria and search.
                    </p>
                }
                {error &&
                <ErrorDismissibleBlock error={error} removeError={removeCustomerError}/>
                }

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