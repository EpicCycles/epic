/*  Data format
first_name(pin): 'Anna'
last_name(pin): 'Weaver'
email(pin): 'anna.weaver@johnlewis.co.uk'
add_date(pin): '2018-07-04T13:02:09.988286+01:00'
upd_date(pin): '2018-07-04T13:02:09.988343+01:00'
 */
import React from "react";
import {Icon} from "semantic-ui-react";
import validateEmailFormat from "../../helpers/utils";
import FormTextInput from "../../common/FormTextInput";

class CustomerDetailEdit extends React.Component {
    state = {
        first_name: '',
        first_nameError: '',
        last_name: '',
        last_nameError: '',
        email: '',
        emailError: '',
        add_date: '',
        upd_date: '',
        isChanged: false,
        isValid: true
    };

    componentWillMount() {
        if (this.props.customer) {
            this.setState({
                first_name: this.props.customer.first_name,
                last_name: this.props.customer.last_name,
                email: this.props.customer.email,
                add_date: this.props.customer.add_date,
                upd_date: this.props.customer.upd_date,
            });
        }
    };

    validateCustomerDataAndSave = () => {
        let isValid = true;
        let first_nameError = "";
        let last_nameError = "";
        let emailError = "";
        const first_name = this.state.first_name;
        const last_name = this.state.last_name;
        const email = this.state.email;

        if (this.props.customer) {
            if (!(first_name)) first_nameError = "First Name must be provided";
            if (!(last_name)) last_nameError = "Last Name must be provided";
        }
        else {
            if (first_name || last_name || email) {
                if (!(first_name)) first_nameError = "First Name must be provided";
                if (!(last_name)) last_nameError = "Last Name must be provided";
            }
        }
        if ((email) && (!validateEmailFormat(email))) emailError = "Invalid Email";

        if (first_nameError || last_nameError || emailError) isValid = false;
        this.setState({
            first_name: first_name,
            last_name: last_name,
            email: email,
            first_nameError: first_nameError,
            last_nameError: last_nameError,
            emailError: emailError,
            isValid: isValid
        });

        isValid && this.props.acceptCustomerChanges(first_name, last_name, email);
    };

    isFormChanged = (first_name, last_name, email) => {
        if (this.props.customer) {
            if (this.props.customer.first_name !== first_name
                || this.props.customer.last_name !== last_name
                || this.props.customer.email !== email) {
                return true;
            }
        } else {
            if (first_name || last_name || email) {
                return true;
            }
        }
        return false;
    };
    handleInputChange = (fieldName, input) => {
        if (fieldName === 'first_name') {
            const isChanged = this.isFormChanged(input, this.state.last_name, this.state.email);
            this.setState({
                first_name: input,
                first_nameError: '', isChanged: isChanged
            });
        } else if (fieldName === 'last_name') {
            const isChanged = this.isFormChanged(this.state.first_name, input, this.state.email);
            this.setState({last_name: input, last_nameError: '', isChanged: isChanged});
        } else if (fieldName === 'email') {
            const isChanged = this.isFormChanged(this.state.first_name, this.state.last_name, input);
            this.setState({email: input, emailError: '', isChanged: isChanged});
        }
    };
    handleInputClear = (fieldName) => {
        if (fieldName === 'removefirst_name') {
            const first_name = this.props.customer ? this.props.customer.first_name : '';
            const isChanged = this.isFormChanged(first_name, this.state.last_name, this.state.email);
            this.setState({
                first_name: first_name,
                first_nameError: '', isChanged: isChanged
            });
        } else if (fieldName === 'removelast_name') {
            const last_name = this.props.customer ? this.props.customer.last_name : '';
            const isChanged = this.isFormChanged(this.state.first_name, last_name, this.state.email);
            this.setState({last_name: last_name, last_nameError: '', isChanged: isChanged});
        } else if (fieldName === 'removeemail') {
            const email = this.props.customer ? this.props.customer.email : '';
            const isChanged = this.isFormChanged(this.state.first_name, this.state.last_name, email);
            this.setState({email: email, emailError: '', isChanged: isChanged});
        }
    };

    onClickReset = () => {
        this.setState({
            first_name: this.props.customer ? this.props.customer.first_name : '',
            first_nameError: '',
            last_name: this.props.customer ? this.props.customer.last_name : '',
            last_nameError: '',
            email: this.props.customer ? this.props.customer.email : '',
            emailError: '',
            isChanged: false,
            isValid: true
        });
    };

    onClickDelete = () => {
        const {customer, deleteCustomer, removeCustomer} = this.props;
        if (customer && customer.id) {
            deleteCustomer(customer);
         } else {
            removeCustomer();
        }
    };

    render() {
        const {first_name, last_name, email, add_date, upd_date, isChanged, isValid, first_nameError, last_nameError, emailError} = this.state;
        const {customer} = this.props;
        const customerInState = (customer && (customer.first_name || customer.last_name || customer.email));

        return <div id="customer-detail">
            <div className="row">
                <FormTextInput
                    placeholder="First Name"
                    id="first-name-input"
                    className="column full"
                    value={first_name}
                    fieldName="first_name"
                    error={first_nameError}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}/>
            </div>
            <div className="row">
                <FormTextInput
                    placeholder="Last Name"
                    id="last-name-input"
                    className="column full"
                    value={last_name}
                    fieldName="last_name"
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={last_nameError}
                />
            </div>
            <div className="row">
                <FormTextInput
                    placeholder="email"
                    id="email-input"
                    className="column full"
                    value={email}
                    fieldName="email"
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={emailError}
                />
            </div>
            {add_date &&
            <div className="row">
                Added on {add_date.substring(0, 10)}, last updated on {upd_date.substring(0, 10)}
            </div>
            }
            <div className="row align_right">
                {isChanged &&
                <Icon id={`reset-cust`} name="undo"
                      onClick={this.onClickReset} title="Reset Customer details"
                />
                }
                {(customerInState || isChanged) &&
                <Icon id={`accept-cust`} name="check" disabled={!isValid}
                      onClick={this.validateCustomerDataAndSave} title="Confirm Customer changes"/>
                }
                {customerInState &&
                <Icon id={`delete-customer`} name="delete"
                      onClick={this.onClickDelete}
                      title="Delete Customer"/>
                }
            </div>
        </div>;
    }
}

export default CustomerDetailEdit;

