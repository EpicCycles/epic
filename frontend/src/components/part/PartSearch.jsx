import React from 'react';
import * as PropTypes from 'prop-types';
import { partSearchFields } from './helpers/search';
import SearchBlock from '../../common/SearchBlock';

class PartSearch extends React.Component {
  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.findParts();
    }
  };
  render() {
    const { onChange, findParts, searchCriteria, searchFields } = this.props;

    const searchCriteriaValid =
      searchCriteria.partTypeSelected ||
      searchCriteria.brandSelected ||
      searchCriteria.searchPartName;
    return (
      <SearchBlock
        searchFields={searchFields}
        onChange={onChange}
        searchFnc={findParts}
        onKeyPress={this.handleKeyPress}
        searchTitle="Find Parts"
        displayRow={false}
        searchCriteria={searchCriteria}
        searchCriteriaValid={!!searchCriteriaValid}
      />
    );
  }
}
PartSearch.defaultProps = {
  searchCriteria: {},
};
PartSearch.propTypes = {
  searchFields: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  findParts: PropTypes.func.isRequired,
  searchCriteria: PropTypes.object,
};
export default PartSearch;
