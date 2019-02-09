import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import PartViewRow from "./PartViewRow";
import {buildFrameWorkPartDisplay} from "./helpers/part";
import SupplierProductViewRow from "../supplierProduct/SupplierProductViewRow";


const PartDisplayGrid = (props) => {
    const { parts, supplierProducts, suppliers, lockFirstColumn, brands, sections } = props;
    const displaySections = buildFrameWorkPartDisplay(sections, parts, false);
    return <div className="grid-container">
        <div key="partBlock" className={`grid`}>
            {displaySections.map((section, sectionIndex) => {
                return section.parts.map((part, typeIndex) => {
                    const supplierProductsForPart = supplierProducts.filter(supplierProduct => supplierProduct.part === part.id);
                    const firstSupplierProduct = supplierProductsForPart.shift();
                    let rowSpan = (supplierProductsForPart.length === 0) ? 1 : supplierProductsForPart.length;
                    return <Fragment>
                        <div key={`partRow${part.id}`}>
                            <div style={{ gridRow: `span ${rowSpan};` }}>{(sectionIndex === 0) && section.name}</div>
                            <PartViewRow
                                part={part}
                                sections={sections}
                                supplierProducts={supplierProductsForPart}
                                brands={brands}
                            />
                            <SupplierProductViewRow
                                supplierProduct={firstSupplierProduct}
                                suppliers={suppliers}
                            />
                        </div>
                        {supplierProductsForPart.map(supplierProduct => <div
                            key={`supplierProductRow${supplierProduct.id}`}>
                            <SupplierProductViewRow
                                supplierProduct={supplierProduct} suppliers={suppliers}/>
                        </div>)}
                    </Fragment>;
                });
            })
            })}
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
    suppliers: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};

export default PartDisplayGrid;
