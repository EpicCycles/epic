import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import PartViewRow from "./PartViewRow";
import {buildFrameWorkPartDisplay} from "./helpers/part";
import SupplierProductViewRow from "../supplierProduct/SupplierProductViewRow";
import PartDisplayGridHeaders from "./PartDisplayGridHeaders";
import {fixedDetailsClassname} from "../app/model/helpers/display";
import {Icon} from "semantic-ui-react";
import {getComponentKey} from "../app/model/helpers/model";

const PartDisplayGrid = (props) => {
    const { parts, supplierProducts, suppliers, showSupplierProducts, lockFirstColumn, brands, sections, editPart, deletePart } = props;
    const displaySections = buildFrameWorkPartDisplay(sections, parts, false);
    const includeActions = (editPart || deletePart);
    return <div className="grid-container">
        <div key="partBlock" className={`grid`}>
            <PartDisplayGridHeaders
                showSupplierProducts={showSupplierProducts}
                lockFirstColumn={lockFirstColumn}
                includeActions={includeActions}
            />
            {displaySections.map((section) => {
                return section.parts.map((part, typeIndex) => {
                    const supplierProductsForPart = supplierProducts.filter(supplierProduct => supplierProduct.part === part.id);
                    const firstSupplierProduct = supplierProductsForPart.shift();
                    let rowSpan = (supplierProductsForPart.length === 0) ? 1 : supplierProductsForPart.length;
                    return <Fragment>
                        <div
                            key={`partRow${part.id}`}
                            className="grid-row"
                        >
                            <div
                                className={`grid-item ${fixedDetailsClassname(lockFirstColumn)}`}
                                style={{ gridRow: `span ${rowSpan}` }}
                                key={`section_${part.id}`}
                            >
                                {(typeIndex === 0) && section.name}
                            </div>
                            <PartViewRow
                                part={part}
                                sections={sections}
                                supplierProducts={supplierProductsForPart}
                                brands={brands}
                                key={`partViewRow${part.id}`}
                            />
                            {showSupplierProducts && <SupplierProductViewRow
                                supplierProduct={firstSupplierProduct}
                                suppliers={suppliers}
                                key={`supplierProduct${getComponentKey(firstSupplierProduct)}`}
                            />}
                            {includeActions && <div
                                className={`grid-item`}
                                style={{ gridRow: `span ${rowSpan}` }}
                                key={`partActions${part.id}`}
                            >
                                {editPart && <Icon
                                    key={`partEdit${part.id}`}
                                    name="edit"
                                    onClick={() => editPart(part)}
                                />}
                                {deletePart && <Icon
                                    key={`partDelete${part.id}`}
                                    name="delete"
                                    onClick={() => deletePart(part.id)}
                                />}
                            </div>
                            }
                        </div>
                        {showSupplierProducts && supplierProductsForPart.map(supplierProduct => <div
                            className="grid-row"
                            key={`supplierProductRow${supplierProduct.id}`}>
                            <SupplierProductViewRow
                                key={`supplierProduct${supplierProduct.id}`}
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
