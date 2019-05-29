import React from "react";
import * as PropTypes from "prop-types";

import {quoteFields} from "./helpers/display";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {getModelKey} from "../app/model/helpers/model";
import ModelViewRow from "../app/model/ModelViewRow";
import ModelActions from "../app/model/ModelActions";
import ModelTableActionHeader from "../app/model/ModelTableActionHeader";
import {QUOTE_ARCHIVED, quoteActions} from "./helpers/quote";

const QuoteGrid = props => {
    const { quotes, getQuote, changeQuote, archiveQuote, unarchiveQuote, cloneQuote, issueQuote, customers, bikes, frames, brands, displayFields, users } = props;
    const unArchivedQuotes = quotes.filter(quote => quote.quote_status !== QUOTE_ARCHIVED);
    const archivedQuotes = quotes.filter(quote => quote.quote_status === QUOTE_ARCHIVED);
    return <div
        key='quotesGrid'
        className="grid"
        style={{
            maxHeight: (window.innerHeight - 120) + "px",
            maxWidth: (window.innerWidth - 120) + "px",
            overflow: "auto"
        }}
    >
        <div key="bikeReviewHeaders" className="grid-row grid-row--header">
            <ModelTableHeaders modelFields={displayFields} lockFirstColumn={true}/>
            <ModelTableActionHeader/>
        </div>
        {unArchivedQuotes.map(quote => {
            const modelKey = getModelKey(quote);
            const actionArray = quoteActions(cloneQuote, issueQuote, changeQuote, quote, getQuote, archiveQuote, unarchiveQuote);
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
        {archivedQuotes.map(quote => {
            const modelKey = getModelKey(quote);
            const actionArray = quoteActions(cloneQuote, issueQuote, changeQuote, quote, getQuote, archiveQuote, unarchiveQuote);
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
    getQuote: PropTypes.func,
    changeQuote: PropTypes.func,
    archiveQuote: PropTypes.func,
    unarchiveQuote: PropTypes.func,
    issueQuote: PropTypes.func,
    cloneQuote: PropTypes.func,
};

export default QuoteGrid;