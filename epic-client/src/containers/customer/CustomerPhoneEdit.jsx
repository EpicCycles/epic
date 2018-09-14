import React from "react";
import {Icon} from "semantic-ui-react";
import FormTextInput from "../../common/FormTextInput";
import SelectInput from "../../common/SelectInput";

class CustomerPhoneEdit extends React.Component {
    state = {
        number_type: 'H',
        telephone: '',
        isChanged: false,
        isValid: true,
        options: [
            { value: 'H', text: 'Home', isDefault: true },
            { value: 'M', text: 'Mobile' },
            { value: 'W', text: 'Work' }
        ]
    };

    componentWillMount() {
        if (this.props.customerPhone) {
            this.setState({
                number_type: this.props.customerPhone.number_type,
                telephone: this.props.customerPhone.telephone
            });
        }
    };
    // TODO use componentDidUpdate(prevProps, prevState) to pick up change

    validateCustomerPhoneData = (number_type, telephone) => {
        let isChanged = false;
        let isValid = true;
        let telephoneError = "";

        if (this.props.customerPhone) {
            if (this.props.customerPhone.number_type !== number_type
                || this.props.customerPhone.telephone !== telephone) {
                isChanged = true;
            }
            if (!(telephone)) telephoneError = "Phone Number must be provided";
        } else {
            isChanged = !!telephone;
        }


        if (telephoneError) isValid = false;
        this.setState({
            number_type: number_type,
            telephone: telephone,
            isChanged: isChanged,
            telephoneError: telephoneError,
            isValid: isValid
        });
    };

    handleInputChange = (fieldName, input) => {
        if (fieldName.startsWith('telephone')) {
            this.validateCustomerPhoneData(this.state.number_type, input);
        }
        else {
            this.validateCustomerPhoneData(input, this.state.telephone);
        }
    };
    handleInputClear = (fieldName) => {
        if (fieldName.startsWith('removetelephone')) {
            const telephone = this.props.customerPhone ? this.props.customerPhone.telephone : '';
            this.validateCustomerPhoneData(this.state.number_type, telephone);
        }
    };

    onClickReset = () => {
        this.setState({
            telephone: this.props.customerPhone ? this.props.customerPhone.telephone : '',
            telephoneError: '',
            number_type: this.props.customerPhone ? this.props.customerPhone.number_type : 'H',
            isChanged: false,
            isValid: true
        });
    };

    saveOrCreateCustomerPhone = () => {
        if (this.props.customerPhone) {
            let phoneToSave = this.props.customerPhone;
            phoneToSave.telephone = this.state.telephone;
            phoneToSave.number_type = this.state.number_type;
            this.props.saveCustomerPhone(phoneToSave);
        }
        else {
            const newPhone = {
                customer: this.props.customerId,
                telephone: this.state.telephone,
                number_type: this.state.number_type
            };
            this.props.saveCustomerPhone(newPhone);
            this.setState({
                telephone: '',
                telephoneError: '',
                number_type: 'H',
                isChanged: false,
                isValid: true
            });
        }
    };

    onClickDelete = () => {
        if (this.props.customerPhone) {
            let phoneToSave = this.props.customerPhone;
            this.props.deleteCustomerPhone(phoneToSave.id);
        } else {
            this.setState({
                telephone: '',
                telephoneError: '',
                number_type: 'H',
                isChanged: false,
                isValid: true
            });
        }
    };

    render() {
        const { telephone, number_type, isChanged, isValid, telephoneError, options } = this.state;
        const { customerPhone } = this.props;
        const keyValue = (customerPhone && customerPhone.id) ? customerPhone.id : "new";
        const componentContext = customerPhone ? customerPhone.id : 'newPhone';
        const type_value = [number_type];
        return <tr id={componentContext}>
            <td>
                <SelectInput
                    fieldName={`number_type_${componentContext}`}
                    options={options}
                    onChange={this.handleInputChange}
                    value={type_value}
                />
            </td>
            <td>
                <FormTextInput
                    placeholder="Phone Number"
                    id={`telephone-input_${componentContext}`}
                    className="column full"
                    value={telephone}
                    fieldName={`telephone_${componentContext}`}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={telephoneError}
                />
            </td>
            <td>
                {(customerPhone && customerPhone.add_date) ?
                    <span>Added on {customerPhone.add_date.substring(0, 10)}, last updated on {customerPhone.upd_date.substring(0, 10)}</span>
                    : <span>Add a new number</span>
                }
            </td>
            <td>
                  <span id={`actions${keyValue}`}>
                      {isChanged &&
                      <Icon id={`reset-phone${keyValue}`} name="undo"
                            onClick={this.onClickReset} title="Reset Phone details"
                      />
                      }
                      {isChanged &&
                      <Icon id={`accept-phone${keyValue}`} name="check" disabled={!isValid}
                            onClick={this.saveOrCreateCustomerPhone}
                            title="Confirm changes"/>
                      }
                      {telephone &&
                      <Icon id={`delete-phone${keyValue}`} name="delete"
                            onClick={this.onClickDelete}
                            title="Delete Phone Number"/>
                      }
                </span>
            </td>
        </tr>;
    }
}

export default CustomerPhoneEdit;

