import React from "react";
import {updateObject} from "../../helpers/utils";
import {addFieldToState, getModelKey} from "../app/model/helpers/model";
import {customerPhoneFields} from "../app/model/helpers/fields";
import EditModelRow from "../app/model/EditModelRow";
import ModelEditIcons from "../app/model/ModelEditIcons";

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

    render() {
        const { customerPhone } = this.state;
        const componentKey = getModelKey(customerPhone);
        const rowClass = (customerPhone && customerPhone.error) ? "error" : "";

        return <div className={rowClass} key={`row${componentKey}`}>
            <EditModelRow
                model={customerPhone}
                persistedModel={this.props.customerPhone}
                modelFields={customerPhoneFields}
                onChange={this.handleInputChange}
            />
            <div
                id={`actions_${componentKey}`}
                key={`actions_${componentKey}`}
                className="grid-item align_center"
            >
                <ModelEditIcons
                    componentKey={componentKey}
                    model={customerPhone}
                    modelSave={this.props.saveCustomerPhone}
                    modelDelete={this.props.deleteCustomerPhone}
                    modelReset={this.onClickReset}
                />
            </div>
        </div>;
    }
}

CustomerPhoneEdit.defaultProps = {
    customerPhone: newCustomerPhone,
};
export default CustomerPhoneEdit;

