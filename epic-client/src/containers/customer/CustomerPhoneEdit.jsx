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

class CustomerPhoneEdit extends React.Component {
    state = {
        customerId: '',
        number_type: 'H',
        telephone: '',
        telephoneError: '',
        add_date: '',
        upd_date: '',
        isChanged: false,
        isValid: true,
        options: [
            {value: 'H', text: 'Home'},
            {value: 'M', text: 'Mobile'},
            {value: 'W', text: 'Work'}
        ]
    };

    componentWillMount() {
        if (this.props.customerPhone) {
            this.setState({
                customerId: this.props.customerPhone.customerId,
                number_type: this.props.customerPhone.number_type,
                telephone: this.props.customerPhone.telephone,
                add_date: this.props.customerPhone.add_date,
                upd_date: this.props.customerPhone.upd_date,
            });
        } else {
            this.setState({
                customerId: this.props.customerId
            });
        }
    };


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

    onNumberTypeChanged = input => {
        this.validateCustomerData(input, this.number_type);
    };
    handleInputChange = (fieldName, input) => {
        if (fieldName === 'telephone') {
            this.validateCustomerData(this.state.number_type, input);
        }
    };
    handleInputClear = (fieldName) => {
        if (fieldName === 'removetelephone') {
            const telephone = this.props.customerPhone ? this.props.customerPhone.telephone : '';
            this.validateCustomerData(this.state.number_type, telephone);
        }
    };

    onClickReset = () => {
        this.setState({
            telephone: this.props.customerPhone ? this.props.customerPhone.telephone : '',
            telephoneError: '',
            number_type: this.props.customer ? this.props.customer.number_type : 'H',
            isChanged: false,
            isValid: true
        });
    };

    render() {
        const {telephone, number_type, add_date, upd_date, isChanged, isValid, telephoneError, options} = this.state;
        const {acceptCustomerChanges} = this.props;

        return <div id="phone-detail">
            <div className="row">
                <Dropdown defaultValue={number_type}
                          fluid selection
                          options={this.state.options}/>
            </div>
            <div className="row">
                <FormTextInput
                    placeholder="Phone Number"
                    id="telephone-input"
                    className="column full"
                    value={telephone}
                    fieldName="telephone"
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={last_nameError}
                />
            </div>
            {add_date &&
            <div className="row">
                Added on {add_date.substring(0, 10)}, last updated on {upd_date.substring(0, 10)}
            </div>
            }
            {isChanged &&
            <div className="align_right">
                <Icon id={`reset-phone`} name="undo"
                      onClick={this.onClickReset} title="Reset Phone details"
                />
                <Icon id={`accept-phone`} name="check" disabled={!isValid}
                      onClick={() => acceptCustomerChanges(first_name, last_name, email)}
                      title="Confirm Customer changes"/>
            </div>
            }

        </div>;
    }
}

export default CustomerPhoneEdit;

