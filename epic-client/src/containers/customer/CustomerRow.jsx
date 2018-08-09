import React from "react";
import {Icon} from "semantic-ui-react";

const CustomerRow = props =>
    <tr key={`cust-row-${props.customer.id}`}>
        <td key={`cust-fn-${props.customer.id}`}>{props.customer.first_name}</td>
        <td key={`cust-ln-${props.customer.id}`}>{props.customer.last_name}</td>
        <td key={`cust-e-${props.customer.id}`}>{props.customer.email}</td>
        <td key={`cust-a-${props.customer.id}`}>{props.customer.add_date.substring(0,10)}</td>
        <td key={`cust-u-${props.customer.id}`}>{props.customer.upd_date.substring(0,10)}</td>
        <td key={`cust-act-${props.customer.id}`}>
            <Icon id={`edit-cust-${props.customer.id}`} name="edit"
                  onClick={() => props.getCustomer(props.customer.id)} title="Edit Customer"/>

        </td>
    </tr>;

export default CustomerRow;