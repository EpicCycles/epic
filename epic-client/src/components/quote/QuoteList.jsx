import React, {Fragment} from 'react';
import * as PropTypes from "prop-types";
import QuoteFind from "./QuoteFind";
import {doWeHaveObjects} from "../../helpers/utils";
import {Button} from "semantic-ui-react";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {quoteFields} from "../app/model/helpers/fields";
import {getModelKey} from "../app/model/helpers/model";
import ModelViewRow from "../app/model/ModelViewRow";
import ModelActions from "../app/model/ModelActions";

class QuoteList extends React.Component {
    render() {
        const { clearQuoteState, searchParams, count, next, isLoading, getBrandsAndSuppliers, getCustomerList, getFrameList, getQuote, getQuoteList, bikes, brands, customers, clearCustomerState, frames, quotes } = this.props;
        const haveQuotes = doWeHaveObjects(quotes);
        const actionArray = [
            {
        iconName: 'view',
        iconTitle: 'view quote',
        iconAction: getQuote,
            }
        ];
        return <Fragment>
            <h1>Quotes</h1>
            {haveQuotes ? <Fragment>
                    <div className="row full align_right">
                        <Button
                            key="newSearch"
                            onClick={clearQuoteState}
                        >
                            New Search
                        </Button>
                    </div>
                    <div
                        key='quotesGrid'
                        className="grid"
                        style={{
                            height: (window.innerHeight - 100) + "px",
                            width: "100%",
                            overflow: "scroll"
                        }}
                    >
                        <div key="bikeReviewHeaders" className="grid-row grid-row--header">
                            <ModelTableHeaders modelFields={quoteFields} lockFirstColumn={true}/>
                            <div className="grid-item--header">action</div>
                        </div>
                        {quotes.map(quote => {
                            const modelKey = getModelKey(quote);
                            return <div
                                            key={`quoteRow${modelKey}`}
                                            className="grid-row"
                                        >
                                <ModelViewRow modelFields={quoteFields} model={quote} lockFirstColumn={true}/>
                                <ModelActions actions={actionArray} componentKey={modelKey} actionsDisabled={(quote.quote_status > 2)}/>
                            </div>;
                        })}
                    </div>
                </Fragment>
                : <QuoteFind
                    bikes={bikes}
                    brands={brands}
                    frames={frames}
                    customers={customers}
                    searchParams={searchParams}
                    count={count}
                    next={next}
                    isLoading={isLoading}
                    getBrandsAndSuppliers={getBrandsAndSuppliers}
                    getFrameList={getFrameList}
                    getCustomerList={getCustomerList}
                    clearCustomerState={clearCustomerState}
                    getQuoteList={getQuoteList}
                />}

        </Fragment>
    }
}

QuoteList.defaultProps = {
    bikes: [],
    suppliers: [],
    frames: [],
    customers: [],
    brands: [],
    quotes: [],
    isLoading: false,
};
QuoteList.propTypes = {
    bikes: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    frames: PropTypes.array,
    customers: PropTypes.array,
    quotes: PropTypes.array,
    searchParams: PropTypes.object,
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    next: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    getBrandsAndSuppliers: PropTypes.func.isRequired,
    getFrameList: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    clearCustomerState: PropTypes.func.isRequired,
    clearQuoteState: PropTypes.func.isRequired,
    getQuoteList: PropTypes.func.isRequired,
    getQuote: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default QuoteList;
