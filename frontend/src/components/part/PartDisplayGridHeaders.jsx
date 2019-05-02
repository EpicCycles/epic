import React from 'react';
import * as PropTypes from 'prop-types';
import PartHeaders from './PartHeaders';
import SupplierProductFieldHeaders from '../supplierProduct/SupplierProductFieldHeaders';
import { fixedHeaderClassname } from '../app/model/helpers/display';

const PartDisplayGridHeaders = props => {
  const { className, lockFirstColumn, showErrors, showSupplierProducts, includeActions } = props;
  return (
    <div className="grid-row grid-row--header " key="part-display-grid-header-row">
      <div
        className={`grid-item--header ${className} ${fixedHeaderClassname(lockFirstColumn)}`}
        key="part-display-grid-header-section"
      >
        Section
      </div>
      <PartHeaders
        showErrors={showErrors}
        className={className}
        key="part-display-grid-header-part-headers"
      />
      {showSupplierProducts && (
        <SupplierProductFieldHeaders
          className={className}
          showErrors={showErrors}
          key="part-display-grid-header-sp-headers"
        />
      )}
      {includeActions && (
        <div className={`grid-item--header ${className}`} key="part-display-grid-header-actions">
          Actions
        </div>
      )}
    </div>
  );
};
PartDisplayGridHeaders.defaultProps = {
  className: '',
};
PartDisplayGridHeaders.propTypes = {
  lockFirstColumn: PropTypes.bool,
  showSupplierProducts: PropTypes.bool,
  showErrors: PropTypes.bool,
  includeActions: PropTypes.any,
  className: PropTypes.string,
};
export default PartDisplayGridHeaders;
