import React from "react";
import * as PropTypes from "prop-types";

import {quoteFields} from "../app/model/helpers/fields";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {getModelKey} from "../app/model/helpers/model";
import ModelViewRow from "../app/model/ModelViewRow";
import ModelActions from "../app/model/ModelActions";

const QuoteGrid = props => {
    const { quotes, getQuote, archiveQuote, unArchiveQuote, customers, bikes, frames, brands, displayFields } = props;
    return <div
        key='quotesGrid'
        className="grid"
        style={{
            height: (window.innerHeight - 120) + "px",
            width: (window.innerWidth) + "px",
            overflow: "auto"
        }}
    >
        <div key="bikeReviewHeaders" className="grid-row grid-row--header">
            <ModelTableHeaders modelFields={displayFields} lockFirstColumn={true}/>
            <div className="grid-item--header">action</div>
        </div>
        {quotes.map(quote => {
            const modelKey = getModelKey(quote);
            const actionArray = [
                {
                    iconName: 'eye',
                    iconTitle: 'view quote',
                    iconAction: getQuote,
                    iconDisabled: (quote.quote_status === 3),
                },
                {
                    iconName: 'remove',
                    iconTitle: 'archive quote',
                    iconAction: archiveQuote,
                    iconDisabled: (quote.quote_status === 3),
                },
                {
                    iconName: 'undo',
                    iconTitle: 'un-archive quote',
                    iconAction: unArchiveQuote,
                    iconDisabled: (quote.quote_status !== 3),
                },
            ];
            return <div
                key={`quoteRow${modelKey}`}
                className="grid-row"
            >
                <ModelViewRow
                    modelFields={displayFields}
                    model={quote}
                    lockFirstColumn={true}
                    customers={customers}
                    brands={brands}
                    bikes={bikes}
                    frames={frames}
                />
                <ModelActions
                    actions={actionArray}
                    componentKey={modelKey}
                    actionsDisabled={(quote.quote_status > 2)}
                />
            </div>;
        })}
    </div>;
};

QuoteGrid.defaultProps = {
    displayFields: quoteFields,
    quotes:[],
};

QuoteGrid.propTypes = {
    displayFields: PropTypes.any.isRequired,
    quotes: PropTypes.array,
    brands: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    customers: PropTypes.array,
    getQuote: PropTypes.func.isRequired,
    archiveQuote: PropTypes.func.isRequired,
    unArchiveQuote: PropTypes.func.isRequired,
};

export default QuoteGrid;