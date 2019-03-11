import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {createNewModelInstance, matchesModel} from "../app/model/helpers/model";
import {customerAddressFields} from "../app/model/helpers/fields";
import CustomerAddressEdit from "./CustomerAddressEdit";

class CustomerAddressGrid extends React.Component {
    state = {
        newAddress: createNewModelInstance(),
    };

    componentDidUpdate(prevProps) {
        if (this.props.addresses !== prevProps.addresses) {
            const newAddressIsOnList = this.props.addresses.some(address => matchesModel(address, customerAddressFields, this.state.newAddress));
            if (newAddressIsOnList) this.setState({ newAddress: createNewModelInstance() })
        }
    }

    saveNewCustomerAddress = (address) => {
        this.setState({newAddress: address});
        this.props.saveCustomerAddress(address);
    };

    render() {
        const { addresses, customerId, saveCustomerAddress, deleteCustomerAddress } = this.props;
        const { newAddress } = this.state;
        const newAddressKey = newAddress.dummyKey;
        return <Fragment>
            <h3>Customer Addresses</h3>
            <div
                key='customerAddressGrid'
                className="grid"
                style={{
                    height: (window.innerHeight * 0.4) + "px",
                    width: (window.innerWidth - 200) + "px",
                    overflow: "scroll"
                }}
            >
                <CustomerAddressEdit
                    key={`editNewAddress${newAddressKey}`}
                    customerId={newAddressKey}
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