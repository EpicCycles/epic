import { compareDatesDescending } from '../../../helpers/sort';
import { generateRandomCode } from '../../../helpers/utils';

export const findSupplierProduct = (part, supplierProducts = []) => {
  const matchedSupplierProducts = supplierProducts.filter(sp => sp.part === part.id);
  if (matchedSupplierProducts.length > 0) {
    matchedSupplierProducts.sort((a, b) => compareDatesDescending(a.check_date, b.check_date));
    return matchedSupplierProducts[0];
  }
};

export const getRelevantSupplierProducts = (part, supplierProducts) => {
  const productsForPart = supplierProducts.filter(sp => sp.part === part.id);
  if (productsForPart.length === 0) productsForPart.push(newSupplierProduct(part.id));
  return productsForPart;
};

export const newSupplierProduct = partId => {
  return { dummyKey: generateRandomCode(), part: partId, deleted: !partId };
};
