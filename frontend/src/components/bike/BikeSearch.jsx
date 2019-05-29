import * as PropTypes from 'prop-types';
import React from 'react';
import { ARCHIVED, CHECKBOX, SELECT_ONE, TEXT } from '../app/model/helpers/fields';
import { buildBrandOptions } from '../brand/helpers/brand';
import SearchBlock from '../../common/SearchBlock';

const BikeSearch = props => {
  const {
    brands,
    onChange,
    brand,
    onKeyPress,
    frameName,
    archived,
    className,
    getFrameList,
    displayRow,
  } = props;
  const searchFields = [
    {
      displayName: 'Brand:',
      fieldName: 'brand',
      type: SELECT_ONE,
      selectList: buildBrandOptions(brands),
    },
    { displayName: 'Frame Name like:', fieldName: 'frameName', type: TEXT },
  ];
  if (props.canSelectArchived)
    searchFields.push({
      displayName: 'Include archived Frames:',
      fieldName: ARCHIVED,
      type: CHECKBOX,
    });
  const selectionCriteria = { brand, frameName, archived };
  return (
    <SearchBlock
      searchFields={searchFields}
      onChange={onChange}
      searchFnc={getFrameList}
      onKeyPress={onKeyPress}
      searchTitle="Find Bikes"
      displayRow={displayRow}
      searchCriteria={selectionCriteria}
      searchCriteriaValid={!!(brand || frameName)}
      className={className}
    />
  );
};
BikeSearch.defaultProps = {
  brands: [],
  className: '',
  displayRow: true,
};
BikeSearch.propTypes = {
  brands: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  brand: PropTypes.string,
  className: PropTypes.string,
  frameName: PropTypes.string,
  canSelectArchived: PropTypes.bool,
  archived: PropTypes.bool,
  displayRow: PropTypes.bool,
  getFrameList: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
};

export default BikeSearch;
