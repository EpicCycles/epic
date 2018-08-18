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
        email: '',
    };

    componentWillMount() {
        if (this.props.searchLastName || this.props.searchFirstName) {
            this.setState({
                firstName: this.props.searchFirstName,
                lastName: this.props.searchLastName,
                email: this.props.searchEmail
            });
        } else if (this.props.customers.length === 0) {
            this.props.getCustomerList("", "", "");
        }
    };

    handleInputChange = (fieldName, input) => {
        if (fieldName === 'firstName') {
             this.setState({firstName: input});
        } else  if (fieldName === 'lastName') {
             this.setState({lastName: input});
        } else  if (fieldName === 'email') {
             this.setState({email: input});
        }
    };
    handleInputClear = (fieldName) => {
        if (fieldName === 'removefirstName') {
             this.setState({firstName: ""});
        } else  if (fieldName === 'removelastName') {
             this.setState({lastName: ""});
        } else  if (fieldName === 'removeemail') {
             this.setState({email: ""});
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const {firstName, lastName, email} = this.state;
        this.props.getCustomerList(firstName, lastName, email);
    };

    render() {
        const {firstName, lastName, email} = this.state;
        const {getCustomerListPage, getCustomer, removeCustomerError, isLoading, customers, count, page, totalPages, error} = this.props;

        return (
            <div id="customer-list">
                <form onSubmit={this.onSubmit}>
                    <h2>Find Customer</h2>
                    <div className="row vertical-middle">
                        <div>First name like:</div>
                        <FormTextInput
                            placeholder="First Name"
                            id="first-name-input"
                            className="column "
                            fieldName="firstName"
                            value={firstName}
                            onChange={this.handleInputChange}
                            onClick={this.handleInputClear}
                        />
                        <div> Last name like:</div>
                        <FormTextInput
                            placeholder="Last Name"
                            id="last-name-input"
                            className="column "
                            fieldName="lastName"
                            onChange={this.handleInputChange}
                            onClick={this.handleInputClear}
                            value={lastName}
                        />
                        <div> email like:</div>
                        <FormTextInput
                            placeholder="bod@gmail.com"
                            id="email-input"
                            className="column "
                            fieldName="email"
                            onChange={this.handleInputChange}
                            onClick={this.handleInputClear}
                            value={email}
                        />
                        <div>
                            <Button type="submit" disabled={isLoading}>Find Customers</Button>
                        </div>
                    </div>
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