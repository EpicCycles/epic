import React from 'react';
import * as PropTypes from 'prop-types';
import QuoteBikeParts from './QuoteBikeParts';
import { quoteFieldsBike } from './helpers/display';
import ModelFieldRow from '../app/model/ModelFieldRow';
import QuoteBikeActions from './QuoteBikeActions';

const QuoteBikes = props => {
  const {
    quotes,
    bikes,
    customers,
    frames,
    users,
    brands,
    suppliers,
    getQuoteToCopy,
    issueQuote,
    changeQuote,
    getQuote,
    archiveQuote,
    unarchiveQuote
  } = props;
  const bikeQuotes = quotes.filter(quote => !!quote.bike);
  return (
    <div className="grid-container">
      <div className="grid">
        {quoteFieldsBike.map((quoteField, index) => {
          return (
            <ModelFieldRow
              field={quoteField}
              modelArray={bikeQuotes}
              bikes={bikes}
              customers={customers}
              brands={brands}
              suppliers={suppliers}
              frames={frames}
              users={users}
              firstRow={index === 0}
            />
          );
        })}
        <QuoteBikeActions quotes={bikeQuotes} />
        <QuoteBikeParts
          quotes={bikeQuotes}
          customers={customers}
          frames={frames}
          users={users}
          cloneQuote={getQuoteToCopy}
          issueQuote={issueQuote}
          changeQuote={changeQuote}
          getQuote={getQuote}
          archiveQuote={archiveQuote}
          unarchiveQuote={unarchiveQuote}
        />
      </div>
    </div>
  );
};
QuoteBikes.propTypes = {
  bikes: PropTypes.array,
  bikeParts: PropTypes.array,
  brands: PropTypes.array,
  suppliers: PropTypes.array,
  sections: PropTypes.array,
  parts: PropTypes.array,
  supplierProducts: PropTypes.array,
  frames: PropTypes.array,
  customers: PropTypes.array.isRequired,
  quotes: PropTypes.array.isRequired,
  quoteParts: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  archiveQuote: PropTypes.func.isRequired,
  unarchiveQuote: PropTypes.func.isRequired,
  changeQuote: PropTypes.func.isRequired,
  saveQuotePart: PropTypes.func.isRequired,
  saveQuote: PropTypes.func.isRequired,
  getQuoteToCopy: PropTypes.func.isRequired,
  getQuote: PropTypes.func.isRequired,
  issueQuote: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default QuoteBikes;
