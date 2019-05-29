// Search fields - array of objects with:
// field name, search type, display name, model Field Name, selectList
// search types - text (find part of field matching string),
//              - number / select one (field must match value)
//              - select multiple (field must match one of values)
//              - checkbox
// options will not be present unless this is select or select multiple
import React from 'react';
import * as PropTypes from 'prop-types';
import EditModelInput from '../components/app/model/EditModelInput';

const Search = props => {
  const { searchFields, searchCriteria, onChange } = props;
  return searchFields.map(field => (
    <div className="grid-row">
      <div className="grid-item--borderless field-label align_right">{field.displayName}</div>
      <div className="grid-item--borderless">
        <EditModelInput
          componentKey="search"
          model={searchCriteria}
          field={field}
          onChange={onChange}
          key={`search_${field.fieldName}`}
        />
      </div>
    </div>
  ));
};
Search.defaultProps = {
  searchCriteria: {},
};
Search.propTypes = {
  searchFields: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  searchCriteria: PropTypes.object,
};
export default Search;
