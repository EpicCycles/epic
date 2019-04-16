import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {getDataList} from "./helpers/partList";
import PartDataList from "./PartDataList";

const PartDataListComplete = (props) => {
    const { dataListPrefix, sections, parts, brands } = props;
    return <Fragment>
        <PartDataList
            dataListId={`${dataListPrefix}-all`}
            parts={parts}
            brands={brands}
        />
        {sections.map(section => section.partTypes.map(partType => <PartDataList
            dataListId={`${dataListPrefix}-${partType.id}`}
            parts={parts.filter(part => part.partType === partType.id)}
            brands={brands}
        />))};
    </Fragment>
};
PartDataListComplete.defaultProps = {
    dataListPrefix: 'parts'
};
PartDataListComplete.propTypes = {
    dataListPrefix: PropTypes.string,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};
export default PartDataListComplete;