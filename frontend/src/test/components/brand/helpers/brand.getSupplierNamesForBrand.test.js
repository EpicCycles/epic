import { getSupplierNamesForBrand } from '../../../../components/brand/helpers/brand';
const suppliers = [
  { id: 21, supplier_name: 'supplier 21' },
  { id: 22, supplier_name: 'supplier 22' },
  { id: 23, supplier_name: 'supplier 23' },
];

describe('getSupplierNamesForBrand', () => {
  it('should return an empty array if no brand is passed', () => {
    expect(getSupplierNamesForBrand()).toEqual([]);
  });
  it('should return an empty array if a brand has no supplier', () => {
    const brand = { id: 21 };
    expect(getSupplierNamesForBrand(brand)).toEqual([]);
  });
  it('should return an empty array if a brand has empty list of supplier', () => {
    const brand = { id: 21, supplier: [] };
    expect(getSupplierNamesForBrand(brand)).toEqual([]);
  });
  it('should return an unknown supplier if a brand has a supplier that is not found', () => {
    const brand = { id: 21, supplier: [99] };
    expect(getSupplierNamesForBrand(brand, suppliers)).toEqual(['Unknown Supplier']);
  });
  it('should return a supplier if a brand has a supplier that is not found', () => {
    const brand = { id: 21, supplier: [21] };
    expect(getSupplierNamesForBrand(brand, suppliers)).toEqual(['supplier 21']);
  });
  it('should return all supplier if a brand has many', () => {
    const brand = { id: 21, supplier: [22, 99, 23] };
    expect(getSupplierNamesForBrand(brand, suppliers)).toEqual([
      'supplier 22',
      'Unknown Supplier',
      'supplier 23',
    ]);
  });
});
