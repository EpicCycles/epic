import React from "react";
import * as PropTypes from "prop-types";
import ModelViewRow from "../app/model/ModelViewRow";
import {customerFields} from "../app/model/helpers/fields";
import ModelActions from "../app/model/ModelActions";

const CustomerListGridRow = props => {
    const { customer, getCustomer, lockFirstColumn } = props;
    const actionArray = {
        iconName: 'edit',
        iconTitle: 'edit customer',
        iconAction: getCustomer,
    };
    return <div
        key={`customerRow${customer.id}`}
        className="grid-row"
    >
        <ModelViewRow
            modelFields={customerFields}
            model={customer}
            lockFirstColumn={lockFirstColumn}
            data-test="customer-fields"
        />
        {getCustomer && <ModelActions
            actions={actionArray}
            componentKey={customer.id}
            key={`customerActions${customer.id}`}
            data-test="customer-actions"
        />
        }
    </div>
};

CustomerListGridRow.defaultProps = {};
CustomerListGridRow.propTypes = {
    customer: PropTypes.object.isRequired,
    getCustomer: PropTypes.func,
    lockFirstColumn: PropTypes.bool,
};
export default CustomerListGridRow;
