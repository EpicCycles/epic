import React from "react";
import {Icon} from "semantic-ui-react";

const Pagination = props => {
    const pagingThing = props.type || "Page";
    const pagingThingLower = pagingThing.toLowerCase();
    const lastPage = props.lastPage || 99999;
    const previous = (props.page > 1) ? (props.page - 1) : props.previous;
    const next = (props.page < props.count) ? (props.page + 1) : props.next;
    return <span id="paging">
        {pagingThing}:&nbsp;
        <Icon
            id="firstPage"
            name="angle double left"
            disabled={!(previous)}
            onClick={() => previous && props.getPage(1)}
            title={`Go to first ${pagingThingLower}`}/>
        <Icon
            id="prevPage"
            name="angle left"
            disabled={!(previous)}
            onClick={() => previous && props.getPage(previous)}
            title={`Go to previous ${pagingThingLower}`}
        />
        <span> {props.page} </span>
        <Icon
            id="nextPage"
            name="angle right"
            disabled={!(next)}
            onClick={() => next && props.getPage(next)}
            title={`Go to next ${pagingThingLower}`}
        />
        <Icon
            id="lastPage"
              name="angle double right"
              disabled={!(next)}
              onClick={() => next && props.getPage(lastPage)}
              title={`Go to last ${pagingThingLower}`}
        />
         (Total count {props.count})
    </span>;
};

export default Pagination;
