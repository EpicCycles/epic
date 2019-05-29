import React from 'react';
import * as PropTypes from 'prop-types';
import QuoteBikeParts from './QuoteBikeParts';
import { quoteFieldsBikeNoCustomer } from './helpers/display';
import ModelFieldRow from '../app/model/ModelFieldRow';
import QuoteBikeActions from './QuoteBikeActions';

const QuoteBikes = props => {
  const {
    quotes,
    quoteParts,
    bikes,
    frames,
    bikeParts,
    parts,
    customers,
    brands,
    suppliers,
    sections,
    users,
    getQuote,
    archiveQuote,
    unarchiveQuote,
    issueQuote,
    cloneQuote,
  } = props;
  const bikeQuotes = quotes.filter(quote => !!quote.bike);
  return (
    <div className="grid-container">
      <div className="grid">
        {quoteFieldsBikeNoCustomer.map((quoteField, index) => {
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
              key={`quoteFieldRow_${quoteField.fieldName}`}
            />
          );
        })}
        <QuoteBikeActions
          quotes={bikeQuotes}
          getQuote={getQuote}
          archiveQuote={archiveQuote}
          unarchiveQuote={unarchiveQuote}
          cloneQuote={cloneQuote}
          issueQuote={issueQuote}
        />
        <QuoteBikeParts
          quotes={bikeQuotes}
          sections={sections}
          quoteParts={quoteParts}
          bikeParts={bikeParts}
          parts={parts}
          brands={brands}
        />
      </div>
    </div>
  );
};
QuoteBikes.propTypes = {
  quotes: PropTypes.array.isRequired,
  quoteParts: PropTypes.array.isRequired,
  bikes: PropTypes.array,
  frames: PropTypes.array,
  bikeParts: PropTypes.array,
  parts: PropTypes.array,
  customers: PropTypes.array.isRequired,
  brands: PropTypes.array,
  suppliers: PropTypes.array,
  sections: PropTypes.array,
  users: PropTypes.array.isRequired,
  getQuote: PropTypes.func.isRequired,
  archiveQuote: PropTypes.func.isRequired,
  unarchiveQuote: PropTypes.func.isRequired,
  cloneQuote: PropTypes.func.isRequired,
  issueQuote: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default QuoteBikes;
