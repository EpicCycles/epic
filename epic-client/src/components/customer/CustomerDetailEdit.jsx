/*  Data format
first_name(pin): 'Anna'
last_name(pin): 'Weaver'
email(pin): 'anna.weaver@johnlewis.co.uk'
add_date(pin): '2018-07-04T13:02:09.988286+01:00'
upd_date(pin): '2018-07-04T13:02:09.988343+01:00'
 */
import React from "react";
import * as PropTypes from "prop-types";
import {Icon} from "semantic-ui-react";
import {updateObject} from "../../helpers/utils";
import {isModelValid, updateModel} from "../app/model/helpers/model";
import {customerFields} from "../app/model/helpers/fields";
import EditModelPage from "../app/model/EditModelPage";

class CustomerDetailEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.customer !== prevProps.customer) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        return updateObject(this.props.customer);
    };
    validateCustomerDataAndSave = () => {
        const isValid = isModelValid(this.state);

        isValid && this.saveOrCreateCustomer(this.state);
    };
    saveOrCreateCustomer = (customer) => {
        if (customer.id) {
            this.props.saveCustomer(customer);
        } else {
            this.props.createCustomer(customer);
        }
    };
    handleInputChange = (fieldName, input) => {
        const newState = updateModel(this.state, customerFields, fieldName, input);
        this.setState(newState);
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    onClickDelete = () => {
        const { customer, deleteCustomer, removeCustomer } = this.props;
        if (customer && customer.id) {
            deleteCustomer(customer.id);
        } else {
            removeCustomer();
        }
    };

    render() {
        const { add_date, upd_date, changed, id } = this.state;
        const isValid = isModelValid(this.state);
        return <div id="customer-detail">
            <EditModelPage
                model={this.state}
                persistedModel={this.props.customer}
                modelFields={customerFields}
                onChange={this.handleInputChange}
            />
            {add_date &&
            <div className="row">
                Added on {add_date.substring(0, 10)}, last updated on {upd_date.substring(0, 10)}
            </div>
            }
            <div className="row align_right">
                {changed &&
                <Icon id={`reset-cust`} name="undo"
                      onClick={this.onClickReset} title="Reset Customer details"
                />
                }
                {(changed) &&
                <Icon id={`accept-cust`} name="check" disabled={!isValid}
                      onClick={isValid && this.validateCustomerDataAndSave} title="Confirm Customer changes"/>
                }
                {id &&
                <Icon id={`delete-customer`} name="delete"
                      onClick={this.onClickDelete}
                      title="Delete Customer"/>
                }
            </div>
        </div>;
    }
}

CustomerDetailEdit.defaultProps = {
    customer: {}
};
CustomerDetailEdit.propTypes = {
    customer: PropTypes.array,
    createCustomer: PropTypes.func.isRequired,
    removeCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
    saveCustomer: PropTypes.func.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
export default CustomerDetailEdit;

