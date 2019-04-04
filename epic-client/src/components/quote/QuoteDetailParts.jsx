import React, {Fragment} from 'react'
import {Dimmer, Loader} from "semantic-ui-react";
import Pagination from "../../common/pagination";
import {findObjectWithId} from "../../helpers/utils";
import {Redirect} from "react-router";
import QuoteEdit from "./QuoteEdit";
import * as PropTypes from "prop-types";
import {findPartsForQuote} from "./helpers/quote";
import PartDisplayGrid from "../part/PartDisplayGrid";
import PartFinder from "../part/PartFinder";
import {getModelKey} from "../app/model/helpers/model";

const initialState = {
    showPartFinder: false,
};

class QuoteDetailParts extends React.Component {
    state = initialState;

    deletePart = (partId) => {
        this.props.deleteQuotePart(this.props.quoteId, partId);
    };
    saveOrAddPart = (part) => {
        const quoteId = this.props.quoteId;
        if (part.id) {
            this.props.saveQuotePart(quoteId, part);
        } else {
            this.props.addQuotePart(quoteId, part);
        }
        this.setState({ partEditPart: part, showPartFinder: false });
    };
    showPartFinder = (part) => {
        this.setState({ partEditPart: part, showPartFinder: true });
    };
    closePartFinder = () => {
        this.setState(initialState);
    };
    deleteQuotePart = (partId) => {
        this.props.deleteQuotePart(this.props.quoteId, partId);
    };

    render() {
        const { quotes, quoteParts, parts, isLoading, brands, sections, saveQuote, archiveQuote, quoteId, listParts } = this.props;
        if (!quoteId) return <Redirect to="/quote-review-list" push/>;
        const { partEditPart, showPartFinder } = this.state;
        const quote = findObjectWithId(quotes, quoteId);
        const partsForQuote = quote ? findPartsForQuote(quote, quoteParts, parts) : [];

        return <Fragment key={`quoteReview`}>
            <section className="row">
                {showPartFinder && <PartFinder
                    sections={sections}
                    parts={parts}
                    brands={brands}
                    savePart={this.saveOrAddPart}
                    deletePart={this.deletePart}
                    findParts={listParts}
                    part={partEditPart}
                    closeAction={this.closePartFinder}
                    partActionPrimary={this.saveOrAddPart}
                    partActionPrimaryIcon={'add'}
                    partActionPrimaryTitle={'Update quote with part'}
                    key={`partFinder${getModelKey(partEditPart)}`}
                />}
                <div>
                    <QuoteEdit
                        quote={quote}
                        brands={brands}
                        frames={frames}
                        saveQuote={saveQuote}
                        archiveQuote={archiveQuote}
                     addPart={this.showPartFinder}
                        key={`editQuote${quote.id}`}
                    />
                    <PartDisplayGrid
                        parts={partsForQuote}
                        sections={sections}
                        brands={brands}
                        editPart={this.showPartFinder}
                        deletePart={this.deleteQuotePart}
                              key={`partGrid${quote.id}`}
              />
                </div>
            </section>

            <Pagination
                type="Quote"
                getPage={this.reviewSelectedQuote}
                lastPage={quoteReviewList.length}
                count={quoteReviewList.length}
                page={(selectedQuoteIndex + 1)}
            />
            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
        </Fragment>
    }
}

QuoteDetailParts.defaultProps = {
    parts: [],
    brands: [],
    sections: [],
    isLoading: false,
};

QuoteDetailParts.propTypes = {
    quoteId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    quoteReviewList: PropTypes.array.isRequired,
    quotes: PropTypes.array.isRequired,
    quoteParts: PropTypes.array.isRequired,
    brands: PropTypes.array,
    sections: PropTypes.array,
    parts: PropTypes.array.isRequired,
    frames: PropTypes.array.isRequired,
    getBrandsAndSuppliers: PropTypes.func.isRequired,
    saveBrands: PropTypes.func.isRequired,
    getFramework: PropTypes.func.isRequired,
    reviewQuote: PropTypes.func.isRequired,
    saveQuote: PropTypes.func.isRequired,
    archiveQuote: PropTypes.func.isRequired,
    getQuote: PropTypes.func.isRequired,
    getQuoteParts: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    deleteQuotePart: PropTypes.func.isRequired,
    addQuotePart: PropTypes.func.isRequired,
    listParts: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
export default QuoteDetailParts;

