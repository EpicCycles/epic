/* eslint-disable react/destructuring-assignment */
import React from 'react';
import * as PropTypes from 'prop-types';
import { updateObject, updateObjectWithSelectionChanges } from '../../helpers/utils';
import SearchBlock from '../../common/SearchBlock';
import { customerSearchFields } from './helpers/search';

class CustomerSearch extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
  };

  componentWillMount() {
    this.setState(updateObject(this.props.searchParams));
  }

  handleInputChange = (fieldName, input) => {
    const newState = updateObjectWithSelectionChanges(this.state, fieldName, input);
    this.setState(newState);
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const { firstName, lastName, email } = this.state;
      this.props.getCustomerList(firstName, lastName, email);
    }
  };

  onSubmit = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const { firstName, lastName, email } = this.state;
    this.props.getCustomerList(firstName, lastName, email);
  };

  render() {
    const { className, isLoading } = this.props;
    return (
      <form onSubmit={this.onSubmit} data-test="search-form">
        <SearchBlock
          searchFields={customerSearchFields}
          onChange={this.handleInputChange}
          searchFnc={this.onSubmit}
          onKeyPress={this.handleKeyPress}
          searchTitle="Find Customers"
          displayRow={true}
          searchCriteria={this.state}
          searchCriteriaValid={!isLoading}
          className={className}
        />
      </form>
    );
  }
}

CustomerSearch.defaultProps = {
  searchParams: {
    firstName: '',
    lastName: '',
    email: '',
  },
  className: 'row',
};
CustomerSearch.propTypes = {
  isLoading: PropTypes.bool,
  searchParams: PropTypes.object,
  getCustomerList: PropTypes.func.isRequired,
  className: PropTypes.string,
};
export default CustomerSearch;
