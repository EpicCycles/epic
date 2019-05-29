import { customerAddressFields } from '../../../../components/app/model/helpers/fields';
import { createEmptyModelWithDefaultFields, modelIsAlreadyInArray } from '../../../../components/app/model/helpers/model';

describe.only('model.modelIsAlreadyInArray', () => {
  it('returns false when the model does not match', () => {
    const arrayToCheck = [];
    const addressToCheck = createEmptyModelWithDefaultFields(customerAddressFields);
    expect(modelIsAlreadyInArray(arrayToCheck, addressToCheck, customerAddressFields)).toBeFalsy();
  });
  it('returns true when the address to check matched except for readonly fields', () => {
    const arrayToCheck = [
      {
        id: 19,
        address1: '1 Mill Lane',
        address2: '',
        address3: '',
        address4: '',
        postcode: 'SY8 1EE',
        country: 'GB',
        add_date: '2019-03-12T14:11:24.900467Z',
        upd_date: '2019-03-12T14:11:24.901461Z',
        customer: 28,
      },
    ];
    const addressToCheck = {
      address1: '1 Mill Lane',
      postcode: 'SY8 1EE',
      country: 'GB',
      add_date: '2019-01-12T14:11:24.900467Z',
      upd_date: '2019-01-12T14:11:24.901461Z',
      dummyKey: 'jhgfkdsjfkadshfgasdf',
    };
    expect(modelIsAlreadyInArray(arrayToCheck, addressToCheck, customerAddressFields)).toBeTruthy();
  });
  it('returns true when there are multipl addresses to check and teh address matches one of them', () => {
    const arrayToCheck = [
      {
        id: 19,
        address1: '1 Mill Lane',
        address2: '',
        address3: '',
        address4: '',
        postcode: 'SY8 1EE',
        country: 'GB',
        add_date: '2019-03-12T14:11:24.900467Z',
        upd_date: '2019-03-12T14:11:24.901461Z',
        customer: 28,
      },
      {
        id: 20,
        address1: '2 Mill Lane',
        address2: 'Streatham',
        address3: '',
        address4: '',
        postcode: 'SY8 1EE',
        country: 'GB',
        add_date: '2019-03-12T14:11:24.900467Z',
        upd_date: '2019-03-12T14:11:24.901461Z',
        customer: 28,
      },
      {
        id: 21,
        address1: '2 Mill Lane',
        postcode: 'SY8 1EE',
        country: 'GB',
        add_date: '2019-03-12T14:11:24.900467Z',
        upd_date: '2019-03-12T14:11:24.901461Z',
        customer: 28,
      },
    ];
    const addressToCheck = {
      address1: '1 Mill Lane',
      postcode: 'SY8 1EE',
      country: 'GB',
      add_date: '2019-01-12T14:11:24.900467Z',
      upd_date: '2019-01-12T14:11:24.901461Z',
    };
    expect(modelIsAlreadyInArray(arrayToCheck, addressToCheck, customerAddressFields)).toBeTruthy();
  });
});
