import React from 'react';
import * as PropTypes from 'prop-types';

import { quoteFields } from './helpers/display';
import { getModelKey } from '../app/model/helpers/model';
import ModelViewRow from '../app/model/ModelViewRow';
import { gridItemClass } from '../app/model/helpers/display';
import QuoteActionCell from './QuoteActionCell';

const QuoteGridRow = props => {
  const {
    quote,
    getQuote,
    changeQuote,
    archiveQuote,
    unarchiveQuote,
    cloneQuote,
    issueQuote,
    customers,
    bikes,
    frames,
    brands,
    displayFields,
    users,
  } = props;
  const modelKey = getModelKey(quote);
  return (
    <div key={`quoteRow${modelKey}`} className="grid-row">
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
      <div
        className={gridItemClass('align_center grid-col--fixed-right', 1, true)}
        data-test="actions"
        key={`action-cell${modelKey}`}
      >
        <QuoteActionCell
          quote={quote}
          cloneQuote={cloneQuote}
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

QuoteGridRow.defaultProps = {
  displayFields: quoteFields,
};

QuoteGridRow.propTypes = {
  displayFields: PropTypes.array.isRequired,
  quote: PropTypes.object.isRequired,
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

export default QuoteGridRow;
