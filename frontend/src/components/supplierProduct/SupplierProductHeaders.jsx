import React from 'react';
import { partFieldsComplete, supplierProductFields } from '../app/model/helpers/fields';
import ModelTableHeaders from '../app/model/ModelTableHeaders';
import AdditionalHeader from '../app/model/AdditionalHeader';

const SupplierProductHeaders = () => {
  return (
    <div className="grid-row grid-row--header ">
      <ModelTableHeaders modelFields={partFieldsComplete} lockFirstColumn={true} />
      <AdditionalHeader headerText="Action" />
      <ModelTableHeaders modelFields={supplierProductFields} />
      <AdditionalHeader headerText="Action" />
    </div>
  );
};
export default SupplierProductHeaders;
