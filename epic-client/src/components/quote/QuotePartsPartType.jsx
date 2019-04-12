import React, {Fragment} from 'react';
import * as PropTypes from "prop-types";
import {findObjectWithId} from "../../helpers/utils";
import QuotePartEdit from "./QuotePartEdit";
import {getModelKey} from "../app/model/helpers/model";
import PartDataList from "../part/PartDataList";

const QuotePartsPartType = props => {
    const { quote, brands, sections, partType, bikePart, quotePart, replacementPart, additionalParts, deleteQuotePart, saveQuotePart, parts, supplierProducts } = props;
    return <Fragment>

        {bikePart && <QuotePartEdit
            deleteQuotePart={deleteQuotePart}
            saveQuotePart={saveQuotePart}
            partType={partType}
            bikePart={bikePart}
            quotePart={quotePart}
            replacementPart={replacementPart}
            componentKey={getModelKey(quotePart)}
            brands={brands}
            parts={parts}
            supplierProducts={supplierProducts}
            sections={sections}
            quote={quote}
        />}
        {additionalParts.map(additionalQuotePart => {
            const part = findObjectWithId(parts, additionalQuotePart.part);
            return <QuotePartEdit
                deleteQuotePart={deleteQuotePart}
                saveQuotePart={saveQuotePart}
                partType={partType}
                quotePart={additionalQuotePart}
                replacementPart={part}
                componentKey={getModelKey(additionalQuotePart)}
                brands={brands}
                sections={sections}
                quote={quote}
                parts={parts}
                supplierProducts={supplierProducts}
            />
        })
        }
        <PartDataList
            dataListId={`parts-${partType.id}`}
            parts={parts}
            partType={partType.id}
            brands={brands}
        />
    </Fragment>
};
QuotePartsPartType.defaultProps = {
    additionalParts: [],
};
QuotePartsPartType.propTypes = {
    partType: PropTypes.object,
    bikePart: PropTypes.object,
    quotePart: PropTypes.object,
    replacementPart: PropTypes.object,
    additionalParts: PropTypes.array,
    parts: PropTypes.array,
    supplierProducts: PropTypes.array,
    deleteQuotePart: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    brands: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    quote: PropTypes.object.isRequired,
};

export default QuotePartsPartType;