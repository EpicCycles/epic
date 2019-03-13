import React from "react";
import * as PropTypes from "prop-types";
import {buildFrameWorkPartDisplay} from "./helpers/part";
import PartDisplayGridHeaders from "./PartDisplayGridHeaders";
import PartDisplayGridRow from "./PartDisplayGridRow";

const PartDisplayGrid = (props) => {
    const { parts, supplierProducts, suppliers, showSupplierProducts, lockFirstColumn, brands, sections, editPart, deletePart } = props;
    const displaySections = buildFrameWorkPartDisplay(sections, parts, false);
    const includeActions = (editPart || deletePart);
    return <div className="grid-container" key="partBlockContainer">
        <div key="partBlock" className={`grid`}>
            <PartDisplayGridHeaders
                showSupplierProducts={showSupplierProducts}
                lockFirstColumn={lockFirstColumn}
                includeActions={includeActions}
                key="partBlockHeaders"
            />
            {displaySections.map((section) => {
                return section.parts.map((part, typeIndex) => {
                    return <PartDisplayGridRow
                        part={part}
                        sections={sections}
                        brands={brands}
                        section={section}
                        suppliers={suppliers}
                        supplierProducts={supplierProducts}
                        showSupplierProducts={showSupplierProducts}
                        lockFirstColumn={lockFirstColumn}
                        editPart={editPart}
                        deletePart={deletePart}
                        includeActions={includeActions}
                        typeIndex={typeIndex}
                    />;
                });
            })}
        </div>
    </div>;
};
PartDisplayGrid.defaultProps = {
    supplierProducts: [],
    suppliers: [],
    lockFirstColumn: false,
    showSupplierProducts: false,
};
PartDisplayGrid.propTypes = {
    parts: PropTypes.array.isRequired,
    supplierProducts: PropTypes.array,
    lockFirstColumn: PropTypes.bool,
    showSupplierProducts: PropTypes.bool,
    sections: PropTypes.array.isRequired,
    suppliers: PropTypes.array,
    brands: PropTypes.array.isRequired,
    editPart: PropTypes.func,
    deletePart: PropTypes.func,
};

export default PartDisplayGrid;
