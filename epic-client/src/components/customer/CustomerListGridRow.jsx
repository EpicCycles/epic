import React from "react";
import * as PropTypes from "prop-types";

const CustomerListGridRow = props => {
    const { customer, getCustomer } = props;
    const actionArray = {
         iconName: 'edit',
        iconTitle: 'edit customer',
        iconAction: getCustomer,
    };
    return <div
        key={`partRow${props.customer.id}`}
        className="grid-row"
    >

    </div>
};

CustomerListGridRow.defaultProps = {

};
CustomerListGridRow.propTypes = {
    customer: PropTypes.object.isRequired,
    getCustomer: PropTypes.func.isRequired,
};
export default CustomerListGridRow;
