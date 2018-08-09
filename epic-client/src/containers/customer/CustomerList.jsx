import React from 'react'
import {Button, Dimmer, Loader} from 'semantic-ui-react'
import Pagination from "../../common/pagination";
import FormTextInput from "../../common/FormTextInput";
import CustomerRow from "./CustomerRow";
import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";

class CustomerList extends React.Component {
    state = {
        firstName: '',
        lastName: '',
    };

    componentWillMount() {
        if (this.props.searchLastName || this.props.searchFirstName) {
            this.setState({
                lastName: this.props.searchFirstName,
                firstName: this.props.searchLastName
            });
        }
    }

    onFirstNameChanged = input => {
        this.setState({ firstName: input });
    };

    onLastNameChanged = input => {
        this.setState({ lastName: input });
    };

    onClearFirstName = () => {
        this.setState({ firstName: '' });
    };

    onClearLastName = () => {
        this.setState({ lastName: '' });
    };

    onSubmit= (event) => {
        event.preventDefault();
        event.stopPropagation();
        const {firstName, lastName} = this.state;
        this.props.getCustomerList(firstName, lastName);
    };

    render() {
        const { firstName, lastName } = this.state;
        const {getCustomerListPage, getCustomer,removeCustomerError, isLoading, customers, count, page, totalPages, error} = this.props;

        return (
            <div id="customer-list">
                <form onSubmit={this.onSubmit}>
                <h1>Find Customer</h1>
                <label htmlFor="search-input" className="search-heading" id="search-input-label">
                    Please enter your search criteria.
                </label>
                <div className="row">
                    <FormTextInput
                        placeholder="First Name"
                        id="first-name-input"
                        className="column full"
                        onChange={this.onFirstNameChanged}
                        value={firstName}
                        onClick={this.onClearFirstName}
                    />
                </div>
                <div className="row">
                    <FormTextInput
                        placeholder="Last Name"
                        id="last-name-input"
                        className="column full"
                        onChange={this.onLastNameChanged}
                        value={lastName}
                        onClick={this.onClearLastName}
                    />
                </div>
                <p>
                    <Button type="submit" disabled={isLoading}>Get Customers</Button>
                </p>
                </form>
                {count > 0 ?
                    <div style={{width: '100%', height: '400px'}}>
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
                        <Pagination
                            id="customer-pagination"
                            page={page}
                            totalPages={totalPages}
                            getPage={getCustomerListPage}/>
                    </div>
                    :
                    <p>
                        Set criteria and search.
                    </p>
                }
                {error &&
                <ErrorDismissibleBlock error={error} removeError={removeCustomerError} />
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