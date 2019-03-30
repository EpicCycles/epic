import React from "react";
import {createEmptyModelWithDefaultFields, getModelKey, updateModel} from "../app/model/helpers/model";
import {customerAddressFields} from "../app/model/helpers/fields";
import * as PropTypes from "prop-types";
import {isItAnObject, updateObject} from "../../helpers/utils";
import ModelEditIcons from "../app/model/ModelEditIcons";
import EditModelPage from "../app/model/EditModelPage";

const initialState = {};

class CustomerAddressEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.customerAddress !== prevProps.customerAddress)  this.setState(this.deriveStateFromProps());
    }

    deriveStateFromProps = () => {
        const propsAddress = this.props.customerAddress;
        if (isItAnObject(propsAddress)) {
            return { customerAddress: updateObject(propsAddress) };
        } else {
            let customerAddress = createEmptyModelWithDefaultFields(customerAddressFields);
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
        const { saveCustomerAddress, deleteCustomerAddress } = this.props;
        const componentKey = getModelKey(customerAddress);
        const rowClass = (customerAddress && customerAddress.error) && "error";
        return <div
            className={rowClass}
            key={`row${componentKey}`}
            title={customerAddress.error || ''}
        >
            <EditModelPage
                model={customerAddress}
                persistedModel={this.props.customerAddress}
                modelFields={customerAddressFields}
                onChange={this.handleInputChange}
                showReadOnlyFields={true}
            />
            <div
                key={`actions_td_${componentKey}`}
                className="align_right"
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

