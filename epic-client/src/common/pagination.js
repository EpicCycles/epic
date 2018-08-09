import React from "react";
import {Icon} from "semantic-ui-react";

const Pagination = props =>
    <span id="paging">
        Page:&nbsp;
        <Icon id="firstPage" name="angle double left" disabled={(props.page < 2)}
              onClick={() => props.getPage(1)} title="Go to page 1"/>
        <Icon id="prevPage" name="angle left" disabled={(props.page < 2)}
              onClick={() => props.getPage(props.page - 1)} title="Go to next page"/>
        <span> {props.page} </span>
        <Icon id="nextPage" name="angle right" disabled={(props.page >= props.totalPages)}
               onClick={() => props.getPage(props.page + 1)} title="Go to previous page"/>
        <Icon id="lastPage" name="angle double right" disabled={(props.page >= props.totalPages)}
              onClick={() => props.getPage(props.totalPages)} title="Go to last page"/>
        <span> of {props.totalPages} </span>

    </span>;

export default Pagination;
