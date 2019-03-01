import React from "react";
import {Icon} from "semantic-ui-react";
import { getComponentKey, isModelValid, updateModel} from "../app/model/helpers/model";
import {customerAddressFields} from "../app/model/helpers/fields";
import EditModelRow from "../app/model/EditModelRow";
import * as PropTypes from "prop-types";
import {isItAnObject} from "../../helpers/utils";

const initialState = { customerAddress: {} };

class CustomerAddressEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.customerAddress !== prevProps.customerAddress) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        let newState = initialState;
        if (isItAnObject(this.props.customerAddress)) {
            newState.customerAddress = this.props.customerAddress
        } else {
            newState.customerAddress = { customer: this.props.customerId }
        }
        return newState;
    };

    handleInputChange = (fieldName, input) => {
        const updatedCustomerAddress = updateModel(this.state.customerAddress, customerAddressFields, fieldName, input);
        this.setState({ customerAddress: updatedCustomerAddress });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    saveOrCreateCustomerAddress = () => {
        this.props.saveCustomerAddress(this.state.customerAddress);
    };

    onClickDelete = () => {
        if (this.props.customerAddress.id) {
            let addressToSave = this.props.customerAddress;
            this.props.deleteCustomerAddress(addressToSave.id);
        } else {
            this.setState(initialState);
        }
    };

    render() {
        const { customerAddress } = this.state;
        const keyValue = getComponentKey(customerAddress);
        const isValid = isModelValid(customerAddress);
        const componentContext = keyValue;
        const rowClass = (customerAddress && customerAddress.error) ? "grid-row error" : "grid-row";
        return <div className={rowClass} key={`row${componentContext}`}>
            <EditModelRow
                model={customerAddress}
                persistedModel={this.props.customerAddress}
                modelFields={customerAddressFields}
                onChange={this.handleInputChange}
            />
            <div key={`date_${componentContext}`} className="grid-item">
                {(customerAddress && customerAddress.add_date) ?
                    <nobr id={`comment_td_${componentContext}`}>Added on {customerAddress.add_date.substring(0, 10)}, last updated on {customerAddress.upd_date.substring(0, 10)}</nobr>
                    : <nobr id={`comment_td_${componentContext}`}>Add a new address</nobr>
                }
            </div>
            <div
                key={`actions_td_${componentContext}`}
                className="grid-item align_center"
            >
                  <span id={`actions${keyValue}`}>
                      {customerAddress.changed &&
                      <Icon id={`reset-address${keyValue}`} name="undo"
                            onClick={this.onClickReset} title="Reset Address details"
                      />
                      }
                      {customerAddress.changed &&
                      <Icon id={`accept-address${keyValue}`} name="check" disabled={!isValid}
                            onClick={isValid && this.saveOrCreateCustomerAddress}
                            title="Confirm changes"/>
                      }
                      {(customerAddress.changed || customerAddress.id) &&
                      <Icon id={`delete-address${keyValue}`} name="delete"
                            onClick={this.onClickDelete}
                            title="Delete Address Number"/>
                      }
                </span>
            </div>
        </div>;
    }
}

CustomerAddressEdit.propTypes = {
    customerAddress: PropTypes.object,
    deleteCustomerAddress: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
}
export default CustomerAddressEdit;

