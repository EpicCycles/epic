import React from 'react';
import * as PropTypes from 'prop-types';
import {gridItemClass} from '../app/model/helpers/display';
import { quoteActions } from './helpers/quote';
import { getModelKey } from '../app/model/helpers/model';
import ModelActions from '../app/model/ModelActions';

const QuoteBikeActions = props => {
  const {
    quotes,
    cloneQuote,
    issueQuote,
    changeQuote,
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
        const actionArray = quoteActions(
          cloneQuote,
          issueQuote,
          changeQuote,
          quote,
          getQuote,
          archiveQuote,
          unarchiveQuote,
        );
        return (
          <div
            className={gridHeaderClass('red', 1, true)}
            data-test="actions"
            key={`action-cell${modelKey}`}
          >
            <ModelActions
              actions={actionArray}
              componentKey={modelKey}
              key={`actions${modelKey}`}
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
  changeQuote: PropTypes.func,
  archiveQuote: PropTypes.func,
  unarchiveQuote: PropTypes.func,
  issueQuote: PropTypes.func,
  cloneQuote: PropTypes.func,
};

export default QuoteBikeActions;
