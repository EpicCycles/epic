import React from "react";
import * as PropTypes from "prop-types";
import {getDataList} from "./helpers/partList";

const PartDataList = (props) => {
    const { dataListId, partType, brand, parts, brands } = props;
    const datalist = getDataList(parts, brands, partType, brand);
    return <datalist id={dataListId}>
        {datalist.map(part => <option
            value={part.dataValue}
        />)
        }
    </datalist>
};

PartDataList.propTypes = {
    dataListId: PropTypes.string.isRequired,
    partType: PropTypes.number,
    brand: PropTypes.number,
    parts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};
export default PartDataList;