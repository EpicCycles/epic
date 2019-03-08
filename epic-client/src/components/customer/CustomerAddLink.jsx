import React from "react";
import {Icon} from "semantic-ui-react";
import * as PropTypes from "prop-types";

const CustomerAddLink = props => <Icon
    key="add-customer"
    data-test="add-customer-icon"
    name="add"
    title="Add New Customer"
    onClick={props.addNewCustomer}
/>;

CustomerAddLink.propTypes = {
    addNewCustomer: PropTypes.func.isRequired,
};
export default CustomerAddLink;