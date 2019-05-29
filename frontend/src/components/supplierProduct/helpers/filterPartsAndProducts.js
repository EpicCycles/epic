import { buildValueArray, findMatchingObjects } from '../../../helpers/search';
import { SUPPLIER } from '../../app/model/helpers/fields';

export const filterPartsAndProducts = (
  searchFields,
  searchCriteria,
  partsComplete,
  supplierProductsComplete,
) => {
  const fieldsToCheck = buildValueArray(searchFields, searchCriteria);

  // first filter product
  const partFieldsToCheck = fieldsToCheck.filter(field => field.modelFieldName !== SUPPLIER);
  const supplierProductFieldsToCheck = fieldsToCheck.filter(
    field => field.modelFieldName === SUPPLIER,
  );
  let parts = findMatchingObjects(partsComplete, partFieldsToCheck);

  if (supplierProductFieldsToCheck.length > 0) {
    const supplierProductsForSupplier = findMatchingObjects(
      supplierProductsComplete,
      supplierProductFieldsToCheck,
    );
    const partIdToInclude = supplierProductsForSupplier.map(sp => sp.part);
    parts = parts.filter(part => partIdToInclude.includes(part.id));
  }
  const partIds = parts.map(part => part.id);
  const supplierProducts = supplierProductsComplete.filter(sp => partIds.includes(sp.part));
  return { parts, supplierProducts };
};
