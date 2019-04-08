import React from 'react';
import * as PropTypes from "prop-types";

import {sectionHasDetail} from "../framework/helpers/display";
import {displayForPartType} from "./helpers/display";
import {doWeHaveObjects} from "../../helpers/utils";
import PartDataList from "../part/PartDataList";
import QuotePartsPartType from "./QuotePartsPartType";
import {getModelKey} from "../app/model/helpers/model";
import QuotePartEdit from "./QuotePartEdit";
import {quotePartNew} from "./helpers/quotePart";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import ModelTableActionHeader from "../app/model/ModelTableActionHeader";

const QuotePartGrid = props => {
    const { quoteParts, brands, sections, parts, bikeParts, deleteQuotePart, saveQuotePart } = props;
    const usedSections = sections.filter(section => (sectionHasDetail(section, quoteParts) || sectionHasDetail(section, bikeParts)));

    return <div className="grid-container">
        <div className='grid'>
            <div key="bikeReviewHeaders" className="grid-row grid-row--header">
                <ModelTableHeaders modelFields={quotePartNew} lockFirstColumn={true}/>
                <ModelTableActionHeader/>
            </div>
            {usedSections.map(section => section.partTypes.map(partType => {
                const displayData = displayForPartType(partType.id, quoteParts, bikeParts, parts);
                if (displayData.bikePart || displayData.quotePart || doWeHaveObjects(displayData.additionalParts)) {
                    return <QuotePartsPartType
                        key={`quote-part-type-${partType.id}`}
                        partType={partType}
                        bikePart={displayData.bikePart}
                        quotePart={displayData.quotePart}
                        replacementPart={displayData.replacementPart}
                        additionalParts={displayData.additionalParts}
                        parts={parts}
                        brands={brands}
                        deleteQuotePart={deleteQuotePart}
                        saveQuotePart={saveQuotePart}
                        sections={sections}
                    />
                } else {
                    return null;
                }
            }))}

            <QuotePartEdit
                deleteQuotePart={deleteQuotePart}
                saveQuotePart={saveQuotePart}
                componentKey={getModelKey()}
                brands={brands}
                parts={parts}
                sections={sections}
            />
        </div>
        <PartDataList dataListId={'all-parts'} parts={parts} brands={brands}/>
    </div>;
};
QuotePartGrid.propTypes = {
    quoteParts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    deleteQuotePart: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    quoteId: PropTypes.number.isRequired,
};

export default QuotePartGrid;