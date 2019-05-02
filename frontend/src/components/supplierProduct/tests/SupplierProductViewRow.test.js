import React from 'react';
import toJson from 'enzyme-to-json';
import SupplierProductViewRow from '../SupplierProductViewRow';

const suppliers = [{ id: 12, name: 'supplier Name' }, { id: 121, name: 'supplier Name 2' }];
test('should display when passed an empty supplier product', () => {
  const component = shallow(<SupplierProductViewRow supplierProduct={{}} suppliers={suppliers} />);
  expect(toJson(component)).toMatchSnapshot();
});
test('should display when passed supplier product', () => {
  const supplierProduct = {
    id: 121,
    supplier: 12,
    part: 3,
    product_code: 'PC101',
    fitted_price: 23.99,
    ticket_price: 24.99,
    rrp: 24.99,
    trade_price: 11,
    club_price: 22.99,
    check_date: new Date('2015-03-25T12:00:00-06:30'),
  };
  const component = shallow(
    <SupplierProductViewRow supplierProduct={supplierProduct} suppliers={suppliers} />,
  );
  expect(toJson(component)).toMatchSnapshot();
});
