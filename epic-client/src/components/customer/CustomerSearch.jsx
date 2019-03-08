import React from 'react'
import {Button} from 'semantic-ui-react'
import FormTextInput from "../../common/FormTextInput";
import {updateObject, updateObjectWithSelectionChanges} from "../../helpers/utils";
import * as PropTypes from "prop-types";


class CustomerSearch extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
    };

    componentWillMount() {
        this.setState(updateObject(this.props.searchParams));
    };

    handleInputChange = (fieldName, input) => {
        let newState = updateObjectWithSelectionChanges(this.state, fieldName, input)
        this.setState(newState);
    };
    handleInputClear = (fieldName) => {
        this.handleInputChange(fieldName, this.props.searchParams[fieldName]);
    };

    onSubmit = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const { firstName, lastName, email } = this.state;
        this.props.getCustomerList(firstName, lastName, email);
    };

    render() {
        const { firstName, lastName, email } = this.state;
        const { isLoading } = this.props;
        return <form onSubmit={this.onSubmit} data-test="search-form">
            <h2>Find Customer</h2>
            <div className="row vertical-middle">
                <div>First name like:</div>
                <FormTextInput
                    placeholder="First Name"
                    id="first-name-input"
                    data-test="first-name-input"
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
                    data-test="last-name-input"
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
                    data-test="email-input"
                    className="column "
                    fieldName="email"
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    value={email}
                />
                <div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    data-test="find-button"
                    >
                        Find Customers
                    </Button>
                </div>
            </div>
        </form>;

    }
}

CustomerSearch.defaultProps = {
    searchParams: {
        firstName: '',
        lastName: '',
        email: '',
    }
};
CustomerSearch.propTypes = {
    isLoading: PropTypes.bool,
    searchParams: PropTypes.object,
    getCustomerList: PropTypes.func.isRequired,
};
export default CustomerSearch;