import { TEXT } from '../../app/model/helpers/fields';

export const customerSearchFields = [
  {
    displayName: 'First name like:',
    fieldName: 'firstName',
    type: TEXT,
    placeholder: 'first name or part',
  },
  {
    displayName: 'Last name like:',
    fieldName: 'lastName',
    type: TEXT,
    placeholder: 'last name or part',
  },
  { displayName: 'email name like:', fieldName: 'email', type: TEXT, placeholder: 'email or part' },
];
