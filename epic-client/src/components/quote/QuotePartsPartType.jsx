import React from 'react';
import * as PropTypes from "prop-types";
import {findObjectWithId} from "../../helpers/utils";
import QuotePartEdit from "./QuotePartEdit";
import {getModelKey} from "../app/model/helpers/model";

const QuotePartsPartType = props => {
    const { brands, partType, bikePart, quotePart, replacementPart, additionalParts, deleteQuotePart, saveQuotePart, parts } = props;
    return <div className='row'>
        <div className='align_right label red'>{partType.name}</div>
        <div>
            {bikePart && <QuotePartEdit
                deleteQuotePart={deleteQuotePart}
                saveQuotePart={saveQuotePart}
                partType={partType}
                bikePart={bikePart}
                quotePart={quotePart}
                replacementPart={replacementPart}
                componentKey={getModelKey(quotePart)}
                brands={brands}
            />}
            {additionalParts.map(additionalQuotePart => {
                const part = findObjectWithId(parts, quotePart.part);
                return <QuotePartEdit
                    deleteQuotePart={deleteQuotePart}
                    saveQuotePart={saveQuotePart}
                    partType={partType}
                    quotePart={additionalQuotePart}
                    replacementPart={part}
                    componentKey={getModelKey(additionalQuotePart)}
                    brands={brands}
                />
            })
            }
        </div>
    </div>
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
    deleteQuotePart: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    brands: PropTypes.array.isRequired,
};

export default QuotePartsPartType;