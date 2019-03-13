import React from "react";
import {Icon} from "semantic-ui-react";
import {createEmptyModelWithDefaultFields, getModelKey, isModelValid, updateModel} from "../app/model/helpers/model";
import {customerAddressFields} from "../app/model/helpers/fields";
import EditModelRow from "../app/model/EditModelRow";
import * as PropTypes from "prop-types";
import {isItAnObject} from "../../helpers/utils";
import ModelEditIcons from "../app/model/ModelEditIcons";

const initialState = {};

class CustomerAddressEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.customerAddress !== prevProps.customerAddress) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        if (isItAnObject(this.props.customerAddress)) {
           return {customerAddress: this.props.customerAddress};
        } else {
            let customerAddress =  createEmptyModelWithDefaultFields(customerAddressFields);
            customerAddress.customer = this.props.customerId;
            return { customerAddress }
        }
    };

    handleInputChange = (fieldName, input) => {
        const updatedCustomerAddress = updateModel(this.state.customerAddress, customerAddressFields, fieldName, input);
        this.setState({ customerAddress: updatedCustomerAddress });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };
    render() {
        const { customerAddress } = this.state;
        const {saveCustomerAddress, deleteCustomerAddress} = this.props;
        const componentKey = getModelKey(customerAddress);
        const rowClass = (customerAddress && customerAddress.error) ? "grid-row error" : "grid-row";
        return <div className={rowClass} key={`row${componentKey}`}>
            <EditModelRow
                model={customerAddress}
                persistedModel={this.props.customerAddress}
                modelFields={customerAddressFields}
                onChange={this.handleInputChange}
            />
            <div key={`date_${componentKey}`} className="grid-item">
                {(customerAddress && customerAddress.add_date) ?
                    <nobr id={`comment_td_${componentKey}`}>Added on {customerAddress.add_date.substring(0, 10)}, last updated on {customerAddress.upd_date.substring(0, 10)}</nobr>
                    : <nobr id={`comment_td_${componentKey}`}>Add a new address</nobr>
                }
            </div>
            <div
                key={`actions_td_${componentKey}`}
                className="grid-item align_center"
            >
                 <ModelEditIcons
                     componentKey={componentKey}
                     model={customerAddress}
                     modelSave={saveCustomerAddress}
                     modelDelete={deleteCustomerAddress}
                     modelReset={this.onClickReset}
                 />
            </div>
        </div>;
    }
}

CustomerAddressEdit.defaultProps = {
    customerAddress: {},
};
CustomerAddressEdit.propTypes = {
    customerAddress: PropTypes.object,
    deleteCustomerAddress: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
};
export default CustomerAddressEdit;

