import {
  BRAND,
  CHECKBOX,
  PART_NAME,
  PART_TYPE,
  SELECT_ONE,
  STANDARD,
  STOCKED,
  TEXT,
} from '../../app/model/helpers/fields';
import { getPartTypeOptions } from '../../partType/helpers/partType';
import { buildBrandOptions } from '../../brand/helpers/brand';

export const partSearchFields = (sections, brands) => {
  return [
    {
      displayName: 'Part Type:',
      fieldName: 'partTypeSelected',
      modelFieldName: PART_TYPE,
      type: SELECT_ONE,
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
