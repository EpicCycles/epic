import {matchesModel} from "../../../../components/app/model/helpers/model";
import {customerAddressFields} from "../../../../components/app/model/helpers/fields";

describe('model.matchesModel', () => {
   it('should return true when all editable model fields match', () => {
       const modelOld = {
           address1: 'Line 1',
           address2: 'Line 2',
           address3: 'Line 3',
           address4: 'Line 4',
           postcode: 'SY8 1EE',
           id: 'id1',
       };
       const modelNew = {
           address1: 'Line 1',
           address2: 'Line 2',
           address3: 'Line 3',
           address4: 'Line 4',
           postcode: 'SY8 1EE',
           id: 'id2',
       };
       expect(matchesModel(modelOld, customerAddressFields, modelNew)).toBeTruthy();
   });
   it('should return false when any editable model field does not match', () => {
       const modelOld = {
           address1: 'Line 1',
           address2: 'Line 2',
           address3: 'Line 3',
           address4: 'Line 4',
           postcode: 'SY8 1EE',
           id: 'id1',
       };
       const modelNew = {
           address1: 'Line 1',
           address2: 'Line 2a',
           address3: 'Line 3',
           address4: 'Line 4',
           postcode: 'SY8 1EE',
           id: 'id2',
       };
       expect(matchesModel(modelOld, customerAddressFields, modelNew)).toBeFalsy();
   });
   it('should return false when any editable model field does not exist', () => {
       const modelOld = {
           address1: 'Line 1',
           address2: 'Line 2',
           address3: 'Line 3',
           address4: 'Line 4',
           postcode: 'SY8 1EE',
           id: 'id1',
       };
       const modelNew = {
           address1: 'Line 1',
           address3: 'Line 3',
           address4: 'Line 4',
           postcode: 'SY8 1EE',
           id: 'id2',
       };
       expect(matchesModel(modelOld, customerAddressFields, modelNew)).toBeFalsy();
   });
});