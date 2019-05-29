import { partSearchFields } from '../../part/helpers/search';
import {
  BRAND,
  CHECKBOX,
  PART_NAME,
  PART_TYPE,
  SELECT_MULTIPLE,
  SELECT_ONE,
  STANDARD,
  STOCKED,
  SUPPLIER,
  TEXT,
} from '../../app/model/helpers/fields';
import { buildSupplierOptions } from '../../supplier/helpers/supplier';
import { getPartTypeOptions } from '../../partType/helpers/partType';
import { buildBrandOptions } from '../../brand/helpers/brand';

export const supplierProductSearchFields = (sections, brands, suppliers) => {
  return [
    {
      displayName: 'Part Type:',
      fieldName: 'partTypeSelected',
      modelFieldName: PART_TYPE,
      type: SELECT_MULTIPLE,
      selectList: getPartTypeOptions(sections),
    },
    {
      displayName: 'Brand:',
      fieldName: 'brandSelected',
      modelFieldName: BRAND,
      type: SELECT_ONE,
      selectList: buildBrandOptions(brands),
    },
    {
      displayName: 'Supplier:',
      fieldName: 'supplierSelected',
      modelFieldName: SUPPLIER,
      type: SELECT_ONE,
      selectList: buildSupplierOptions(suppliers),
    },
    {
      displayName: 'Part name contains:',
      modelFieldName: PART_NAME,
      fieldName: 'searchPartName',
      type: TEXT,
      placeholder: 'part name',
    },
    {
      displayName: 'Standard only',
      fieldName: 'searchStandard',
      modelFieldName: STANDARD,
      type: CHECKBOX,
    },
    {
      displayName: 'Stocked only',
      fieldName: 'searchStocked',
      modelFieldName: STOCKED,
      type: CHECKBOX,
    },
  ];
};
