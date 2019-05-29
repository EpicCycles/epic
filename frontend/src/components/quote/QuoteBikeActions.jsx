import React from 'react';
import * as PropTypes from 'prop-types';
import { gridItemClass } from '../app/model/helpers/display';
import { getModelKey } from '../app/model/helpers/model';
import QuoteActionCell from './QuoteActionCell';

const QuoteBikeActions = props => {
  const {
    quotes,
    cloneQuote,
    issueQuote,
    getQuote,
    archiveQuote,
    unarchiveQuote,
  } = props;
  return (
    <div className="grid-row  " key="quote-bike-actions">
      <div className={gridItemClass('red', 0, true)} data-test="quote-bike-action-start">
        Actions
      </div>
      {quotes.map(quote => {
        const modelKey = getModelKey(quote);
        return (
          <div
            className={gridItemClass('red', 1, true)}
            data-test="actions"
            key={`action-cell${modelKey}`}
          >
            <QuoteActionCell
              quote={quote}
              archiveQuote={archiveQuote}
              unarchiveQuote={unarchiveQuote}
              cloneQuote={cloneQuote}
              issueQuote={issueQuote}
              getQuote={getQuote}
              key={`actions_${modelKey}`}
            />
          </div>
        );
      })}
    </div>
  );
};

QuoteBikeActions.propTypes = {
  quotes: PropTypes.array.isRequired,
  getQuote: PropTypes.func,
  archiveQuote: PropTypes.func,
  unarchiveQuote: PropTypes.func,
  issueQuote: PropTypes.func,
  cloneQuote: PropTypes.func,
};

export default QuoteBikeActions;
