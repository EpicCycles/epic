import { getCountryName } from '../../../../components/address/helpers/address';
describe('getCountryName', () => {
  it('no country code no name', () => {
    expect(getCountryName()).not.toBeDefined();
  });
  it('no country matching code use code', () => {
    expect(getCountryName('ZZZ')).toBe('ZZZ');
  });
  it('no country code no name', () => {
    expect(getCountryName('GB')).toBe('United Kingdom');
  });
});
