/* eslint-disable react/no-access-state-in-setstate,react/destructuring-assignment */
import React from 'react';
import * as PropTypes from 'prop-types';
import { updateObject } from '../../helpers/utils';
import { checkForChangesAllFields, updateModel } from '../app/model/helpers/model';
import { quoteFields, quoteFieldsNoBike } from './helpers/display';
import EditModelPage from '../app/model/EditModelPage';
import ModelEditIcons from '../app/model/ModelEditIcons';

class QuoteEdit extends React.Component {
  state = {
    quote: updateObject(this.props.quote),
    persistedQuote: this.props.quote,
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (checkForChangesAllFields(quoteFields, props.quote, state.persistedQuote)) {
      return {
        quote: updateObject(props.quote),
        persistedQuote: props.quote,
      };
    }
    return null;
  }

  handleInputChange = (fieldName, input) => {
    let { quote } = this.state;
    quote = updateModel(quote, quoteFields, fieldName, input);
    this.setState({ quote });
  };

  onClickReset = () => {
    const { persistedQuote } = this.state;
    const quote = updateObject(persistedQuote);
    this.setState({ quote });
  };

  render() {
    const { quote, persistedQuote } = this.state;
    const fields = quote.bike ? quoteFields : quoteFieldsNoBike;
    const {
      componentKey,
      customers,
      bikes,
      frames,
      brands,
      users,
      saveQuote,
      archiveQuote,
    } = this.props;
    return (
      <div className="fit-content">
        <EditModelPage
          model={quote}
          persistedModel={persistedQuote}
          modelFields={fields}
          onChange={this.handleInputChange}
          showReadOnlyFields
          customers={customers}
          bikes={bikes}
          brands={brands}
          frames={frames}
          users={users}
        />
        <div className="align_right">
          <ModelEditIcons
            componentKey={componentKey}
            model={quote}
            modelSave={saveQuote}
            modelDelete={archiveQuote}
            modelReset={this.onClickReset}
          />
        </div>
      </div>
    );
  }
}

QuoteEdit.defaultProps = {
  quote: {},
};
QuoteEdit.propTypes = {
  quote: PropTypes.object,
  createQuote: PropTypes.func,
  archiveQuote: PropTypes.func.isRequired,
  saveQuote: PropTypes.func.isRequired,
  componentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bikes: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  frames: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};
export default QuoteEdit;
