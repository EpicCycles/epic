import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {createEmptyModelWithDefaultFields, matchesModel} from "../app/model/helpers/model";
import {customerAddressFields} from "../app/model/helpers/fields";
import CustomerAddressEdit from "./CustomerAddressEdit";
import {updateObject} from "../../helpers/utils";

class CustomerAddressGrid extends React.Component {
    state = {
        newAddress: createEmptyModelWithDefaultFields(customerAddressFields),
    };

    componentDidUpdate(prevProps) {
        if (this.props.addresses !== prevProps.addresses) {
            const newAddressIsOnList = this.props.addresses.some(address => matchesModel(address, customerAddressFields, this.state.newAddress));
            if (newAddressIsOnList) this.setState({ newAddress: createEmptyModelWithDefaultFields(customerAddressFields) })
        }
    }

    saveNewCustomerAddress = (address) => {
        const addressToSave = updateObject(address, {customer:this.props.customerId});
        this.setState({newAddress: addressToSave});
        this.props.saveCustomerAddress(addressToSave);
    };

    render() {
        const { addresses, customerId, saveCustomerAddress, deleteCustomerAddress } = this.props;
        const { newAddress } = this.state;
        const newAddressKey = newAddress.dummyKey;
        return <Fragment>
            <h3>Customer Addresses</h3>
            <div
                key='customerAddressGrid'
                className="grid-2"
             >
                <CustomerAddressEdit
                    key={`editNewAddress${newAddressKey}`}
                    customerId={customerId}
                    saveCustomerAddress={this.saveNewCustomerAddress}
                    deleteCustomerAddress={deleteCustomerAddress}
                    customerAddress={newAddress}
                    data-test="new-address"
                />
                {addresses.map((address) => {
                    return <CustomerAddressEdit
                        key={`editAddress${address.id}`}
                        customerId={customerId}
                        saveCustomerAddress={saveCustomerAddress}
                        deleteCustomerAddress={deleteCustomerAddress}
                        customerAddress={address}
                                   data-test="existing-address"
     />
                })}
            </div>
        </Fragment>;
    };
}
CustomerAddressGrid.defaultProps = {
    addresses: [],
};
CustomerAddressGrid.propTypes = {
    addresses: PropTypes.array,
    deleteCustomerAddress: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
};
export default CustomerAddressGrid;