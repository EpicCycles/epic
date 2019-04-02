import React, {Fragment} from 'react';
import * as PropTypes from "prop-types";
import QuoteFind from "./QuoteFind";
import {doWeHaveObjects} from "../../helpers/utils";
import {Button, Dimmer, Loader} from "semantic-ui-react";
import {quoteFields} from "../app/model/helpers/fields";
import QuoteGrid from "./QuoteGrid";

class QuoteList extends React.Component {

    render() {
        const { clearQuoteState, searchParams, count, next, isLoading, getBrandsAndSuppliers, getCustomerList, getFrameList, getQuote, getQuoteList, bikes, brands, customers, clearCustomerState, frames, quotes, archiveQuote, unarchiveQuote } = this.props;
        const haveQuotes = doWeHaveObjects(quotes);

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
                    <QuoteGrid
                        displayFields={quoteFields}
                        getQuote={getQuote}
                        archiveQuote={archiveQuote}
                        unarchiveQuote={unarchiveQuote}
                        quotes={quotes}
                        customers={customers}
                        brands={brands}
                        bikes={bikes}
                        frames={frames}
                    />
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
    archiveQuote: PropTypes.func.isRequired,
    unarchiveQuote: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default QuoteList;
