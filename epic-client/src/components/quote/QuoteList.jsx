import React, {Fragment} from 'react';
import * as PropTypes from "prop-types";
import QuoteFind from "./QuoteFind";
import {doWeHaveObjects} from "../../helpers/utils";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {quoteFields} from "../app/model/helpers/fields";
import {getModelKey} from "../app/model/helpers/model";
import ModelViewRow from "../app/model/ModelViewRow";
import ModelActions from "../app/model/ModelActions";

class QuoteList extends React.Component {
    archiveQuote = quoteId => {
        alert('would archive');
    };
    render() {
        const { clearQuoteState, searchParams, count, next, isLoading, getBrandsAndSuppliers, getCustomerList, getFrameList, getQuote, getQuoteList, bikes, brands, customers, clearCustomerState, frames, quotes } = this.props;
        const haveQuotes = doWeHaveObjects(quotes);
        const actionArray = [
            {
                iconName: 'eye',
                iconTitle: 'view quote',
                iconAction: getQuote,
            },
            {
                iconName: 'remove',
                iconTitle: 'archive quote',
                iconAction: this.archiveQuote,
            }
        ];
        return <Fragment>
            {haveQuotes ? <Fragment>
                    <div className="row full">
                        <div style={{
                            width: (window.innerWidth - 200) + "px",
                        }}>
                            <h1>Quotes</h1>
                        </div>
                        <Button
                            key="newSearch"
                            onClick={clearQuoteState}
                            style={{
                                width: "200px",
                                overflow: "auto"
                            }}
                        >
                            New Search
                        </Button>
                    </div>
                    <div
                        key='quotesGrid'
                        className="grid"
                        style={{
                            height: (window.innerHeight - 120) + "px",
                            width: (window.innerWidth) + "px",
                            overflow: "auto"
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
                                <ModelViewRow modelFields={quoteFields} model={quote} lockFirstColumn={true}
                                              customers={customers}/>
                                <ModelActions actions={actionArray} componentKey={modelKey}
                                              actionsDisabled={(quote.quote_status > 2)}/>
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
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
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
