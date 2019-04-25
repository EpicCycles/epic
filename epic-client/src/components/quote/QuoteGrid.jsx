import React from "react";
import * as PropTypes from "prop-types";

import {quoteFields} from "./helpers/display";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {getModelKey} from "../app/model/helpers/model";
import ModelViewRow from "../app/model/ModelViewRow";
import ModelActions from "../app/model/ModelActions";
import ModelTableActionHeader from "../app/model/ModelTableActionHeader";

const QuoteGrid = props => {
    const { quotes, getQuote, changeQuote, archiveQuote, unarchiveQuote, customers, bikes, frames, brands, displayFields, users } = props;
    return <div
        key='quotesGrid'
        className="grid"
        style={{
            height: (window.innerHeight - 120) + "px",
            maxWidth: (window.innerWidth - 120) + "px",
            overflow: "auto"
        }}
    >
        <div key="bikeReviewHeaders" className="grid-row grid-row--header">
            <ModelTableHeaders modelFields={displayFields} lockFirstColumn={true}/>
            <ModelTableActionHeader/>
        </div>
        {quotes.map(quote => {
            const modelKey = getModelKey(quote);
            const actionArray = [];
            if (changeQuote) actionArray.push({
                iconName: 'eye',
                iconTitle: 'view quote',
                iconAction: changeQuote,
                iconDisabled: (quote.quote_status === '3'),
            });
            if (getQuote) actionArray.push({
                iconName: 'edit',
                iconTitle: 'edit quote',
                iconAction: getQuote,
                iconDisabled: (quote.quote_status === '3'),
            });
            if (archiveQuote) actionArray.push({
                iconName: 'remove',
                iconTitle: 'archive quote',
                iconAction: archiveQuote,
                iconDisabled: (quote.quote_status === '3'),
            });
            if (unarchiveQuote) actionArray.push({
                iconName: 'undo',
                iconTitle: 'un-archive quote',
                iconAction: unarchiveQuote,
                iconDisabled: (quote.quote_status !== '3'),
            });
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
                    users={users}
                />
                <ModelActions
                    actions={actionArray}
                    componentKey={modelKey}
                />
            </div>;
        })}
    </div>;
};

QuoteGrid.defaultProps = {
    displayFields: quoteFields,
    quotes: [],
};

QuoteGrid.propTypes = {
    displayFields: PropTypes.array.isRequired,
    quotes: PropTypes.array,
    brands: PropTypes.array,
    bikes: PropTypes.array,
    frames: PropTypes.array,
    customers: PropTypes.array,
    users: PropTypes.array,
    getQuote: PropTypes.func.isRequired,
    changeQuote: PropTypes.func.isRequired,
    archiveQuote: PropTypes.func.isRequired,
    unarchiveQuote: PropTypes.func.isRequired,
};

export default QuoteGrid;