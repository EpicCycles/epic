import React from "react";
import {Icon} from "semantic-ui-react";
import FormTextInput from "../../common/FormTextInput";
import SelectInput from "../../common/SelectInput";
import {updateObject} from "../../helpers/utils";
import {addFieldToState, getModelKey, isModelValid} from "../app/model/helpers/model";
import {bikeFields, customerAddressFields, customerPhoneFields} from "../app/model/helpers/fields";
import EditModelRow from "../app/model/EditModelRow";

const newCustomerPhone = {
    number_type: 'H',
    telephone: '',
};
const initialState = {};

class CustomerPhoneEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        this.setState({
            customerPhone: updateObject(this.props.customerPhone)
        });
    };

    handleInputChange = (fieldName, input) => {
        const updatedCustomerPhone = addFieldToState(this.state.customerPhone, customerPhoneFields, fieldName, input);
        this.setState({ customerPhone: updatedCustomerPhone });
    };

    onClickReset = () => {
        this.setState({
            customerPhone: updateObject(this.props.customerPhone)
        });
    };

    saveOrCreateCustomerPhone = () => {
        this.props.saveCustomerPhone(this.state.customerPhone);
    };

    onClickDelete = () => {
        if (this.props.customerPhone.id) {
            this.props.deleteCustomerPhone(this.props.customerPhone.id);
        } else {
            this.setState({customerPhone:newCustomerPhone});
        }
    };

    render() {
        const { customerPhone } = this.state;
        const { telephone, isChanged, } = customerPhone;
        const keyValue = getModelKey(customerPhone);
        const componentContext = keyValue;
        const rowClass = (customerPhone && customerPhone.error) ? "error" : "";
        const isValid = isModelValid(customerPhone);

        return <div className={rowClass} key={`row${componentContext}`}>
            <EditModelRow
                model={customerPhone}
                persistedModel={this.props.customerPhone}
                modelFields={customerPhoneFields}
                onChange={this.handleInputChange}
            />
            <div id={`actions_${componentContext}`}>
                  <span id={`actions${keyValue}`}>
                      {isChanged &&
                      <Icon id={`reset-phone${keyValue}`} name="undo"
                            onClick={this.onClickReset} title="Reset Phone details"
                      />
                      }
                      {isChanged &&
                      <Icon id={`accept-phone${keyValue}`} name="check" disabled={!isValid}
                            onClick={isValid && this.saveOrCreateCustomerPhone}
                            title="Confirm changes"/>
                      }
                      {telephone &&
                      <Icon id={`delete-phone${keyValue}`} name="delete"
                            onClick={this.onClickDelete}
                            title="Delete Phone Number"/>
                      }
                </span>
            </div>
        </div>;
    }
}

CustomerPhoneEdit.defaultProps = {
    customerPhone: newCustomerPhone,
};
export default CustomerPhoneEdit;

