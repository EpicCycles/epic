import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {createEmptyModelWithDefaultFields, matchesModel} from "../app/model/helpers/model";
import {customerPhoneFields} from "../app/model/helpers/fields";
import CustomerPhoneEdit from "./CustomerPhoneEdit";
import {updateObject} from "../../helpers/utils";

class CustomerPhoneGrid extends React.Component {
    state = {
        newPhone: createEmptyModelWithDefaultFields(customerPhoneFields),
    };

    componentDidUpdate(prevProps) {
        if (this.props.phones !== prevProps.phones) {
            const newPhoneIsOnList = this.props.phones.some(phone => matchesModel(phone, customerPhoneFields, this.state.newPhone));
            if (newPhoneIsOnList) this.setState({ newPhone: createEmptyModelWithDefaultFields(customerPhoneFields) })
        }
    }

    saveNewCustomerPhone = (phone) => {
        const phoneToSave = updateObject(phone, {customer: this.props.customerId})
        this.setState({ newPhone: phoneToSave });
        this.props.saveCustomerPhone(phoneToSave);
    };

    render() {
        const { phones, saveCustomerPhone, deleteCustomerPhone } = this.props;
        const { newPhone } = this.state;
        const newPhoneKey = newPhone.dummyKey;
        return <Fragment>
            <h3>Customer Phone</h3>
            <div
                key='customerPhoneGrid'
                className="grid"
            >
                <CustomerPhoneEdit
                    key={`editNewPhone${newPhoneKey}`}
                    saveCustomerPhone={this.saveNewCustomerPhone}
                    deleteCustomerPhone={deleteCustomerPhone}
                    customerPhone={newPhone}
                    data-test="new-phone"
                />
                {phones.map((phone) => {
                    return <CustomerPhoneEdit
                        key={`editPhone${phone.id}`}
                        saveCustomerPhone={saveCustomerPhone}
                        deleteCustomerPhone={deleteCustomerPhone}
                        customerPhone={phone}
                        data-test="existing-phone"
                    />
                })}
            </div>
        </Fragment>;
    };
}

CustomerPhoneGrid.defaultProps = {
    phones: [],
};
CustomerPhoneGrid.propTypes = {
    phones: PropTypes.array,
    deleteCustomerPhone: PropTypes.func.isRequired,
    saveCustomerPhone: PropTypes.func.isRequired,
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
};
export default CustomerPhoneGrid;