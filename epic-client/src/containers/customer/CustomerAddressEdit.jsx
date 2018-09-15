import React from "react";
import {Icon} from "semantic-ui-react";
import FormTextInput from "../../common/FormTextInput";

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

    onClickReset = () => {
        this.setState(initialState);
    };

    saveOrCreateCustomerAddress = () => {
        // if (this.state.postcode && !validatePostcodeFormat(this.state.postcode)) {
        //     this.setState({ postcodeError: "Invalid Postcode", isValid: false });
        //     return false;
        // }

        if (this.props.customerAddress && this.props.customerAddress.id) {
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
        }
                this.setState({saveInProgress:true})

    };

    onClickDelete = () => {
        if (this.props.customerAddress && this.props.customerAddress.id) {
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
        const rowClass = (customerAddress && customerAddress.error) ? "error" : "";
        return <tr id={`row${componentContext}`} className={rowClass}>
            <td id={`address1-td_${componentContext}`}>
                <FormTextInput
                    placeholder="Address line 1"
                    id={`address1-input_${componentContext}`}
                    className="column full"
                    value={address1}
                    fieldName={`address1_${componentContext}`}
                    onChange={this.handleInputChange}
                    error={address1Error}
                />
            </td>
            <td id={`address2_td_${componentContext}`}>
                <FormTextInput
                    placeholder="Address line 2"
                    id={`address2-input_${componentContext}`}
                    className="column full"
                    value={address2}
                    fieldName={`address2_${componentContext}`}
                    onChange={this.handleInputChange}
                />
            </td>
            <td id={`address3_td_${componentContext}`}>
                <FormTextInput
                    placeholder="Address line 3"
                    id={`address3-input_${componentContext}`}
                    className="column full"
                    value={address3}
                    fieldName={`address3_${componentContext}`}
                    onChange={this.handleInputChange}
                    size="30"
                />
            </td>
            <td id={`address4_td_${componentContext}`}>
                <FormTextInput
                    placeholder="Address line 4"
                    id={`address4-input_${componentContext}`}
                    className="column full"
                    value={address4}
                    fieldName={`address4_${componentContext}`}
                    onChange={this.handleInputChange}
                    size="30"
                />
            </td>
            <td id={`postcode_td_${componentContext}`}>
                <FormTextInput
                    placeholder="Postcode"
                    id={`postcode-input_${componentContext}`}
                    className="column full"
                    value={postcode}
                    fieldName={`postcode_${componentContext}`}
                    onChange={this.handleInputChange}
                    error={postcodeError}
                    size="10"
                />
            </td>
            <td id={`detail_td_${componentContext}`}>
                {(customerAddress && customerAddress.add_date) ?
                    <span id={`comment_td_${componentContext}`}>Added on {customerAddress.add_date.substring(0, 10)}, last updated on {customerAddress.upd_date.substring(0, 10)}</span>
                    : <span id={`comment_td_${componentContext}`}>Add a new address</span>
                }
            </td>
            <td id={`actions_td_${componentContext}`}>
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

