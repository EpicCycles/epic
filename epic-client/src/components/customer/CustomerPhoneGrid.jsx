import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {createNewModelInstance, matchesModel} from "../app/model/helpers/model";
import {customerPhoneFields} from "../app/model/helpers/fields";
import CustomerPhoneEdit from "./CustomerPhoneEdit";

class CustomerPhoneGrid extends React.Component {
    state = {
        newPhone: createNewModelInstance(),
    };

    componentDidUpdate(prevProps) {
        if (this.props.phones !== prevProps.phones) {
            const newPhoneIsOnList = this.props.phones.some(phone => matchesModel(phone, customerPhoneFields, this.state.newPhone));
            if (newPhoneIsOnList) this.setState({ newPhone: createNewModelInstance() })
        }
    }

    saveNewCustomerPhone = (phone) => {
        this.setState({ newPhone: phone });
        this.props.saveCustomerPhone(phone);
    };

    render() {
        const { phones, customerId, saveCustomerPhone, deleteCustomerPhone } = this.props;
        const { newPhone } = this.state;
        const newPhoneKey = newPhone.dummyKey;
        return <Fragment>
            <h3>Customer Phone Numberss</h3>
            <div
                key='customerPhoneGrid'
                className="grid"
                style={{
                    height: (window.innerHeight * 0.4) + "px",
                    width: (window.innerWidth - 200) + "px",
                    overflow: "scroll"
                }}
            >
                <CustomerPhoneEdit
                    key={`editNewPhone${newPhoneKey}`}
                    customerId={customerId}
                    saveCustomerPhone={this.saveNewCustomerPhone}
                    deleteCustomerPhone={deleteCustomerPhone}
                    customerPhone={newPhone}
                    data-test="new-phone"
                />
                {phones.map((phone) => {
                    return <CustomerPhoneEdit
                        key={`editPhone${phone.id}`}
                        customerId={customerId}
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