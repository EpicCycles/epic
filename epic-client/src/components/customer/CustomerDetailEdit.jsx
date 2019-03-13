import React from "react";
import * as PropTypes from "prop-types";
import {updateObject} from "../../helpers/utils";
import {updateModel} from "../app/model/helpers/model";
import {customerFields} from "../app/model/helpers/fields";
import EditModelPage from "../app/model/EditModelPage";
import ModelEditIcons from "../app/model/ModelEditIcons";

class CustomerDetailEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.customer !== prevProps.customer) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        return { customer: updateObject(this.props.customer) };
    };

    saveOrCreateCustomer = (customer) => {
        if (customer.id) {
            this.props.saveCustomer(customer);
        } else {
            this.props.createCustomer(customer);
        }
    };
    handleInputChange = (fieldName, input) => {
        const customer = updateModel(this.state.customer, customerFields, fieldName, input);
        this.setState({ customer });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    render() {
        const { customer } = this.state;
        const { add_date, upd_date } = customer;
        const { componentKey } = this.props;
        return <div id="customer-detail">
            <EditModelPage
                model={customer}
                persistedModel={this.props.customer}
                modelFields={customerFields}
                onChange={this.handleInputChange}
            />
            {add_date &&
            <div>
                Added on {add_date.substring(0, 10)}, last updated on {upd_date.substring(0, 10)}
            </div>
            }
            <div className="align_right">
                <ModelEditIcons
                    componentKey={componentKey}
                    model={customer}
                    modelSave={this.saveOrCreateCustomer}
                    modelDelete={this.props.deleteCustomer}
                    modelReset={this.onClickReset}
                />
            </div>
        </div>;
    }
}

CustomerDetailEdit.defaultProps = {
    customer: {}
};
CustomerDetailEdit.propTypes = {
    customer: PropTypes.object,
    createCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
    saveCustomer: PropTypes.func.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
export default CustomerDetailEdit;

