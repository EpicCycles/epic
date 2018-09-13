import React from "react";
import {Icon} from "semantic-ui-react";
import FormTextInput from "../../common/FormTextInput";
import {validatePostcodeFormat} from "../../helpers/utils";

const initialState = {
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    postcode: '',
    address1Error: '',
    postcodeError: '',
    isChanged: false,
    isValid: true
};

class CustomerAddressEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        if (this.props.customerAddress) {
            this.setState({
                address1: this.props.customerAddress.address1,
                address2: this.props.customerAddress.address2,
                address3: this.props.customerAddress.address3,
                address4: this.props.customerAddress.address4,
                postcode: this.props.customerAddress.postcode
            });
        }
    };

    validateCustomerAddressData = (address1, address2, address3, address4, postcode) => {
        let isChanged = false;
        let isValid = true;
        let address1Error = "";
        let postcodeError = "";

        if (this.props.customerAddress) {
            if (this.props.customerAddress.address1 !== address1
                || this.props.customerAddress.address2 !== address2
                || this.props.customerAddress.address3 !== address3
                || this.props.customerAddress.address4 !== address4
                || this.props.customerAddress.postcode !== postcode) {
                isChanged = true;
            }
        } else {
            isChanged = (address1 || address2 || address3 || address4 || postcode);
        }

        if (isChanged) {
            if (!(address1)) address1Error = "At least 1 line of address must be provided";
            if (!(postcode)) postcodeError = "Postcode must be provided";
        }

        if (address1Error || postcodeError) isValid = false;

        this.setState({
            address1: address1,
            address2: address2,
            address3: address3,
            address4: address4,
            postcode: postcode,
            address1Error: address1Error,
            postcodeError: postcodeError,
            isChanged: isChanged,
            isValid: isValid
        });
    };

    handleInputChange = (fieldName, input) => {
        let address1 = this.state.address1;
        let address2 = this.state.address2;
        let address3 = this.state.address3;
        let address4 = this.state.address4;
        let postcode = this.state.postcode;
        if (fieldName.startsWith('address1')) address1 = input;
        if (fieldName.startsWith('address2')) address2 = input;
        if (fieldName.startsWith('address3')) address3 = input;
        if (fieldName.startsWith('address4')) address4 = input;
        if (fieldName.startsWith('postcode')) postcode = input;

        this.validateCustomerAddressData(address1, address2, address3, address4, postcode);
    };

    handleInputClear = (fieldName) => {
        let address1 = this.state.address1;
        let address2 = this.state.address2;
        let address3 = this.state.address3;
        let address4 = this.state.address4;
        let postcode = this.state.postcode;
        if (fieldName.startsWith('removeaddress1')) address1 = this.props.customerAddress ? this.props.customerAddress.address1 : '';
        if (fieldName.startsWith('removeaddress2')) address2 = this.props.customerAddress ? this.props.customerAddress.address2 : '';
        if (fieldName.startsWith('removeaddress3')) address3 = this.props.customerAddress ? this.props.customerAddress.address3 : '';
        if (fieldName.startsWith('removeaddress4')) address4 = this.props.customerAddress ? this.props.customerAddress.address4 : '';
        if (fieldName.startsWith('removepostcode')) postcode = this.props.customerAddress ? this.props.customerAddress.postcode : '';

        this.validateCustomerAddressData(address1, address2, address3, address4, postcode);
    };

    onClickReset = () => {
        this.setState(initialState);
    };

    saveOrCreateCustomerAddress = () => {
        if (this.state.postcode && !validatePostcodeFormat(this.state.postcode)) {
           this.setState({ postcodeError: "Invalid Postcode", isValid: false});
           return false;
        }

        if (this.props.customerAddress) {
            let addressToSave = this.props.customerAddress;
            addressToSave.address1 = this.state.address1;
            addressToSave.address2 = this.state.address2;
            addressToSave.address3 = this.state.address3;
            addressToSave.address4 = this.state.address4;
            addressToSave.postcode = this.state.postcode;
            this.props.saveCustomerAddress(addressToSave);
        }
        else {
            const newAddress = {
                customer: this.props.customerId,
                address1: this.state.address1,
                address2: this.state.address2,
                address3: this.state.address3,
                address4: this.state.address4,
                postcode: this.state.postcode
            };
            this.props.saveCustomerAddress(newAddress);
            this.setState(initialState);
        }
    };

    onClickDelete = () => {
        if (this.props.customerAddress) {
            let addressToSave = this.props.customerAddress;
            this.props.deleteCustomerAddress(addressToSave.id);
        } else {
            this.setState(initialState);
        }
    };

    render() {
        const { address1, address2, address3, address4, postcode, isChanged, isValid, address1Error, postcodeError } = this.state;
        const { customerAddress } = this.props;
        const keyValue = (customerAddress && customerAddress.id) ? customerAddress.id : "new";
        const componentContext = customerAddress ? customerAddress.id : 'newAddress';
        return <tr id={componentContext}>
            <td>
                <FormTextInput
                    placeholder="Address line 1"
                    id={`address1-input_${componentContext}`}
                    className="column full"
                    value={address1}
                    fieldName={`address1_${componentContext}`}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={address1Error}
                />
            </td>
            <td>
                <FormTextInput
                    placeholder="Address line 2"
                    id={`address2-input_${componentContext}`}
                    className="column full"
                    value={address2}
                    fieldName={`address2_${componentContext}`}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
            </td>
            <td>
                <FormTextInput
                    placeholder="Address line 3"
                    id={`address3-input_${componentContext}`}
                    className="column full"
                    value={address3}
                    fieldName={`address3_${componentContext}`}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
            </td>
            <td>
                <FormTextInput
                    placeholder="Address line 4"
                    id={`address4-input_${componentContext}`}
                    className="column full"
                    value={address4}
                    fieldName={`address4_${componentContext}`}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
            </td>
            <td>
                <FormTextInput
                    placeholder="Postcode"
                    id={`postcode-input_${componentContext}`}
                    className="column full"
                    value={postcode}
                    fieldName={`postcode_${componentContext}`}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={postcodeError}
                />
            </td>
            <td>
                {(customerAddress && customerAddress.add_date) ?
                    <span>Added on {customerAddress.add_date.substring(0, 10)}, last updated on {customerAddress.upd_date.substring(0, 10)}</span>
                    : <span>Add a new address</span>
                }
            </td>
            <td>
                  <span id={`actions${keyValue}`}>
                      {isChanged &&
                      <Icon id={`reset-address${keyValue}`} name="undo"
                            onClick={this.onClickReset} title="Reset Address details"
                      />
                      }
                      {isChanged &&
                      <Icon id={`accept-address${keyValue}`} name="check" disabled={!isValid}
                            onClick={this.saveOrCreateCustomerAddress}
                            title="Confirm changes"/>
                      }
                      {(address1 || address2 || address3 || address4 || postcode) &&
                      <Icon id={`delete-address${keyValue}`} name="delete"
                            onClick={this.onClickDelete}
                            title="Delete Address Number"/>
                      }
                </span>
            </td>
        </tr>;
    }
}

export default CustomerAddressEdit;

