import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import {partCanBeOmitted, partCanBeSubstituted} from "./helpers/part";
import {fixedDetailsClassname} from "../app/model/helpers/display";
import {getComponentKey} from "../app/model/helpers/model";
import PartViewRow from "./PartViewRow";
import SupplierProductViewRow from "../supplierProduct/SupplierProductViewRow";
import {Icon} from "semantic-ui-react";

const PartDisplayGridRow = (props) => {
    const { part, sections, suppliers, brands, section, lockFirstColumn, typeIndex, supplierProducts, showSupplierProducts, includeActions, editPart, deletePart } = props;
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
                data-test="section-cell"
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
                data-test="part-actions"
            >
                {(editPart && partCanBeSubstituted(part, sections)) && <Icon
                    key={`partEdit${part.id}`}
                    name="edit"
                    onClick={() => editPart(part)}
                    data-test="edit-icon"
                />}
                {(deletePart && partCanBeOmitted(part, sections)) && <Icon
                    key={`partDelete${part.id}`}
                    name="delete"
                    onClick={() => deletePart(part.id)}
                    data-test="delete-icon"
                />}
            </div>
            }
        </div>
        {showSupplierProducts && supplierProductsForPart.map(supplierProduct => <div
            className="grid-row"
            key={`supplierProductRow${supplierProduct.id}`}>
            <SupplierProductViewRow
                key={`supplierProduct${supplierProduct.id}`}
                supplierProduct={supplierProduct}
                suppliers={suppliers}
            />
        </div>)}
    </Fragment>;
};
PartDisplayGridRow.propTypes = {
    part: PropTypes.object.isRequired,
    sections: PropTypes.array.isRequired,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    section: PropTypes.object.isRequired,
    lockFirstColumn: PropTypes.bool,
    typeIndex: PropTypes.number,
    supplierProducts: PropTypes.array,
    showSupplierProducts: PropTypes.bool,
    includeActions: PropTypes.bool,
    editPart: PropTypes.func,
    deletePart: PropTypes.func
};
export default PartDisplayGridRow;
