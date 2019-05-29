import { getBrandsForSupplier } from '../../../../components/supplier/helpers/supplier';

describe('getBrandsForSupplier', () => {
  it('should return empty array when no brands passed', () => {
    expect(getBrandsForSupplier(1)).toEqual([]);
  });
  it('should return empty array when empty array of brands passed', () => {
    expect(getBrandsForSupplier(1, [])).toEqual([]);
  });
  it('should return empty array when no brands have the supplier provided', () => {
    const brands = [{ id: 101, supplier: [] }, { id: 102, supplier: [2, 3] }];
    expect(getBrandsForSupplier(1, brands)).toEqual([]);
  });
  it('should return single entry array when one brand has the supplier provided', () => {
    const brands = [
      { id: 101, supplier: [], brand_name: 'brand 101' },
      { id: 102, supplier: [2, 3], brand_name: 'brand 102' },
      { id: 103, supplier: [1], brand_name: 'brand 103' },
    ];
    expect(getBrandsForSupplier(1, brands)).toEqual(['brand 103']);
  });
  it('should return multiple entry array when many brand has the supplier provided', () => {
    const brands = [
      { id: 101, supplier: [], brand_name: 'brand 101' },
      { id: 102, supplier: [2, 3, 1], brand_name: 'brand 102' },
      { id: 103, supplier: [1], brand_name: 'brand 103' },
    ];
    expect(getBrandsForSupplier(1, brands)).toEqual(['brand 102', 'brand 103']);
  });
});
