import React from 'react';
import * as PropTypes from 'prop-types';
import Search from './Search';
import SearchButton from './SearchButton';

const SearchBlock = props => {
  const {
    searchFields,
    searchCriteria,
    onChange,
    displayRow,
    searchFnc,
    searchCriteriaValid,
    searchTitle,
    className,
    onKeyPress,
  } = props;
  const blockClassName = displayRow ? 'row  vertical-middle' : 'fit-block';
  return (
    <div className={`${blockClassName} ${className}`} onKeyPress={onKeyPress}>
      <Search searchFields={searchFields} searchCriteria={searchCriteria} onChange={onChange} />
      <SearchButton onClick={searchFnc} disabled={!searchCriteriaValid} title={searchTitle} />
    </div>
  );
};
SearchBlock.defaultProps = {
  searchCriteria: {},
  searchTitle: 'Search',
  className: '',
};
SearchBlock.propTypes = {
  searchFields: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  searchFnc: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  searchTitle: PropTypes.string.isRequired,
  searchCriteria: PropTypes.object,
  displayRow: PropTypes.bool,
  searchCriteriaValid: PropTypes.bool,
};
export default SearchBlock;
