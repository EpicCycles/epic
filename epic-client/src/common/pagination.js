import React from "react";
import {Icon} from "semantic-ui-react";

const Pagination = props =>
    <span id="paging">
        Page:&nbsp;
        <Icon id="firstPage" name="angle double left"  disabled={!(props.previous)}
              onClick={() => props.getPage(1)} title="Go to page 1"/>
        <Icon id="prevPage" name="angle left" disabled={!(props.previous)}
              onClick={() => props.getPage(props.previous)} title="Go to previous page"/>
        <span> {props.page} </span>
        <Icon id="nextPage" name="angle right" disabled={!(props.next)}
               onClick={() => props.getPage(props.next)} title="Go to next page"/>
        <Icon id="lastPage" name="angle double right" disabled={!(props.next)}
              onClick={() => props.getPage(99999)} title="Go to last page"/>
         (Total count {props.count})
    </span>;

export default Pagination;
