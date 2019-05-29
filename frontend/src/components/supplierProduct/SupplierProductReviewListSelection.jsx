import * as PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import SearchBlock from '../../common/SearchBlock';
class SupplierProductReviewListSelection extends React.Component {
  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.listParts();
    }
  };
  render() {
    const { onChange, listParts, hasSelectionCriteria, searchFields, searchCriteria } = this.props;
    return (
      <Fragment>
        <h2>Get Parts</h2>
        <SearchBlock
          searchFields={searchFields}
          onChange={onChange}
          searchFnc={listParts}
          onKeyPress={this.handleKeyPress}
          searchTitle="Find Products"
          displayRow={false}
          searchCriteria={searchCriteria}
          searchCriteriaValid={hasSelectionCriteria}
        />
      </Fragment>
    );
  }
}
SupplierProductReviewListSelection.defaultProps = {
  searchCriteria: {},
};
SupplierProductReviewListSelection.propTypes = {
  searchFields: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  hasSelectionCriteria: PropTypes.bool,
  listParts: PropTypes.func.isRequired,
  searchCriteria: PropTypes.object,
};

export default SupplierProductReviewListSelection;
