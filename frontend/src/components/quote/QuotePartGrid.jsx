import React from 'react';
import * as PropTypes from "prop-types";

import {sectionHasDetail} from "../framework/helpers/display";
import {displayForPartType} from "./helpers/display";
import {doWeHaveObjects} from "../../helpers/utils";
import QuotePartsPartType from "./QuotePartsPartType";
import {getModelKey} from "../app/model/helpers/model";
import QuotePartEdit from "./QuotePartEdit";
import {buildQuotePart, quotePartNew} from "./helpers/quotePart";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import ModelTableActionHeader from "../app/model/ModelTableActionHeader";
import PartDataListComplete from "../part/PartDataListComplete";

const QuotePartGrid = props => {
    const { quote, quoteParts, brands, suppliers, sections, parts, supplierProducts, bikeParts, deleteQuotePart, saveQuotePart } = props;
    const usedSections = sections.filter(section => (sectionHasDetail(section, quoteParts) || sectionHasDetail(section, bikeParts)));
    const newQuotePart = buildQuotePart(quote.id);

    return <div className="grid-container">
        <div className='grid'>
            <div key="bikeReviewHeaders" className="grid-row grid-row--header">
                <ModelTableHeaders modelFields={quotePartNew(quote)} lockFirstColumn={true}/>
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
                        supplierProducts={supplierProducts}
                        brands={brands}
                        suppliers={suppliers}
                        deleteQuotePart={deleteQuotePart}
                        saveQuotePart={saveQuotePart}
                        sections={sections}
                        quote={quote}
                    />
                } else {
                    return null;
                }
            }))}

            <QuotePartEdit
                deleteQuotePart={deleteQuotePart}
                saveQuotePart={saveQuotePart}
                componentKey={getModelKey(newQuotePart)}
                brands={brands}
                suppliers={suppliers}
                parts={parts}
                supplierProducts={supplierProducts}
                sections={sections}
                quote={quote}
                quotePart={newQuotePart}
                key={newQuotePart.dummyKey}
            />
        </div>
        <PartDataListComplete sections={sections} parts={parts} brands={brands}/>
    </div>;
};
QuotePartGrid.propTypes = {
    quoteParts: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    supplierProducts: PropTypes.array.isRequired,
    bikeParts: PropTypes.array.isRequired,
    deleteQuotePart: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    quote: PropTypes.object.isRequired,
};

export default QuotePartGrid;