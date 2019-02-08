import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import PartViewRow from "./PartViewRow";
import {buildFrameWorkPartDisplay} from "./helpers/part";


const PartDisplayGrid = (props) => {
    const { parts, supplierProducts, lockFirstColumn, brands, sections } = props;
    const displaySections = buildFrameWorkPartDisplay(sections,parts, false);
    return <div className="grid-container">
        <div key="partBlock" className={`grid`}>
            {displaySections.map((section, sectionIndex) =>
                section.parts.map((part, typeIndex) => <PartViewRow
                        part={part}
                        sections={sections}
                        supplierProducts={supplierProducts.filter(supplierProduct => supplierProduct.part === part.id)}
                        brands={brands}
                    />))}
        </div>
    </div>;
};
PartDisplayGrid.defaultProps = {
    supplierProducts: [],
};
PartDisplayGrid.propTypes = {
    parts: PropTypes.array.isRequired,
    supplierProducts: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    sections: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};

export default PartDisplayGrid;
