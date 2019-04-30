import React from 'react'
import FormTextInput from "../../common/FormTextInput";
import {updateObject, updateObjectWithSelectionChanges} from "../../helpers/utils";
import * as PropTypes from "prop-types";
import SearchButton from "../../common/SearchButton";


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
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { firstName, lastName, email } = this.state;
            this.props.getCustomerList(firstName, lastName, email);
        }
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
        const { isLoading, className } = this.props;
        return <form onSubmit={this.onSubmit} data-test="search-form">
            <div className={className}>
                <div>First name like:</div>
                <FormTextInput
                    placeholder="First Name"
                    id="first-name-input"
                    data-test="first-name-input"
                    fieldName="firstName"
                    value={firstName}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    onKeyPress={this.handleKeyPress}
                />
                <div> Last name like:</div>
                <FormTextInput
                    placeholder="Last Name"
                    id="last-name-input"
                    data-test="last-name-input"
                    fieldName="lastName"
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    value={lastName}
                    onKeyPress={this.handleKeyPress}
                />
                <div> email like:</div>
                <FormTextInput
                    placeholder="bod@gmail.com"
                    id="email-input"
                    data-test="email-input"
                    fieldName="email"
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    value={email}
                    onKeyPress={this.handleKeyPress}
                />
                <SearchButton
                    onClick={this.onSubmit}
                    title={`Find matching customers`}
                    data-test="find-button"
                    disabled={isLoading}
                />
            </div>
        </form>;

    }
}

CustomerSearch.defaultProps = {
    searchParams: {
        firstName: '',
        lastName: '',
        email: '',
    },
    className: 'row',
};
CustomerSearch.propTypes = {
    isLoading: PropTypes.bool,
    searchParams: PropTypes.object,
    getCustomerList: PropTypes.func.isRequired,
    className: PropTypes.string,
};
export default CustomerSearch;