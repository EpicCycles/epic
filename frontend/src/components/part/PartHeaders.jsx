/* eslint-disable react/destructuring-assignment */
import React, {Fragment} from 'react';
import * as PropTypes from 'prop-types';
import { partFieldsComplete } from '../app/model/helpers/fields';
import ModelTableHeaders from '../app/model/ModelTableHeaders';
import AdditionalHeader from '../app/model/AdditionalHeader';

const PartHeaders = props => (
  <Fragment>
    <ModelTableHeaders modelFields={partFieldsComplete} lockFirstColumn={props.lockFirstColumn} />
    {props.showErrors && <AdditionalHeader headerText="Errors" className={props.className} />}
  </Fragment>
);
PartHeaders.defaultProps = {
  lockFirstColumn: false,
  showErrors: false,
  className: '',
};
PartHeaders.propTypes = {
  lockFirstColumn: PropTypes.bool,
  showErrors: PropTypes.bool,
  className: PropTypes.string,
};
export default PartHeaders;
