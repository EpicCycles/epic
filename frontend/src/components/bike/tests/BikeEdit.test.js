import React from 'react';
import toJson from 'enzyme-to-json';
import BikeEdit from '../BikeEdit';
import {
  assertComponentHasExpectedProps,
  findDataTest,
} from '../../../../../test/jest_helpers/assert';
import { bikeFields } from '../../app/model/helpers/fields';

const frames = [
  {
    id: 14,
    brand_name: 'Haibike',
    frame_name: 'Trekking',
    archived: false,
    archived_date: null,
    brand: 3,
  },
  {
    id: 13,
    brand_name: 'Haibike',
    frame_name: 'Urban',
    archived: false,
    archived_date: null,
    brand: 3,
  },
  {
    id: 27,
    brand_name: 'Raleigh',
    frame_name: 'Motus',
    archived: false,
    archived_date: null,
    brand: 4,
  },
];
const brands = [
  { brand_name: 'Bianchi', link: 'https://bianchi.co.uk', id: 8 },
  { brand_name: 'Haibike', id: 3 },
];
const bike = {
  id: 58,
  model_name: '4',
  description: null,
  colours: 'anthracite/black/lime',
  rrp: null,
  epic_price: null,
  club_price: '2249.00',
  sizes: null,
  frame: 14,
};

describe('basic render', () => {
  const props = {
    bike,
    brands,
    frames,
  };
  let component;
  let saveBike;
  let deleteBikes;
  beforeEach(() => {
    saveBike = jest.fn();
    deleteBikes = jest.fn();
    component = shallow(<BikeEdit {...props} saveBike={saveBike} deleteBikes={deleteBikes} />);
  });

  test('should show the bike name and bike edit page when rendered', () => {
    expect(toJson(component)).toMatchSnapshot();
    const modelEdit = component.find('EditModelPage');
    assertComponentHasExpectedProps(modelEdit, {
      model: props.bike,
      persistedModel: props.bike,
      modelFields: bikeFields,
    });
    expect(findDataTest(component, 'reset-bike')).toHaveLength(0);
    expect(findDataTest(component, 'save-bike')).toHaveLength(0);
    expect(findDataTest(component, 'delete-bike')).toHaveLength(1);
    expect(findDataTest(component, 'add-bike-part')).toHaveLength(0);
  });

  test('should not show save if field changed but invalid', () => {
    component.instance().handleInputChange('model_name', '');
    component.update();

    expect(findDataTest(component, 'reset-bike')).toHaveLength(1);
    expect(findDataTest(component, 'save-bike')).toHaveLength(0);
    expect(findDataTest(component, 'delete-bike')).toHaveLength(1);
    expect(findDataTest(component, 'add-bike-part')).toHaveLength(0);
  });
  test('should reset display when invalid changes reset', () => {
    component.instance().handleInputChange('model_name', '');
    component.update();

    expect(findDataTest(component, 'reset-bike')).toHaveLength(1);
    expect(findDataTest(component, 'save-bike')).toHaveLength(0);
    expect(findDataTest(component, 'delete-bike')).toHaveLength(1);
    expect(findDataTest(component, 'add-bike-part')).toHaveLength(0);

    expect(component.state('changed')).toBeTruthy();

    findDataTest(component, 'reset-bike').simulate('click');
    component.update();
    expect(component.state('changed')).toBeFalsy();

    expect(findDataTest(component, 'reset-bike')).toHaveLength(0);
    expect(findDataTest(component, 'save-bike')).toHaveLength(0);
    expect(findDataTest(component, 'delete-bike')).toHaveLength(1);
    expect(findDataTest(component, 'add-bike-part')).toHaveLength(0);
  });
  test('should call save function passed', () => {
    component.instance().handleInputChange('rrp', '1000');
    component.update();
    expect(findDataTest(component, 'reset-bike')).toHaveLength(1);
    expect(findDataTest(component, 'save-bike')).toHaveLength(1);
    expect(findDataTest(component, 'delete-bike')).toHaveLength(1);
    expect(findDataTest(component, 'add-bike-part')).toHaveLength(0);

    expect(component.state('changed')).toBeTruthy();
    findDataTest(component, 'save-bike').simulate('click');
    expect(saveBike).toHaveBeenCalledTimes(1);
    expect(saveBike).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 58,
        model_name: '4',
        description: null,
        colours: 'anthracite/black/lime',
        epic_price: null,
        club_price: '2249.00',
        sizes: null,
        frame: 14,
        rrp: '1000',
      }),
    );
  });
  test('should call delete function passed', () => {
    findDataTest(component, 'delete-bike').simulate('click');
    expect(deleteBikes).toHaveBeenCalledTimes(1);
    expect(deleteBikes).toHaveBeenCalledWith([58]);
  });
});

describe('With add part', () => {
  const props = {
    bike,
    brands,
    frames,
    saveBike: jest.fn(),
    deleteBikes: jest.fn(),
  };
  let component;
  let addPart;
  beforeEach(() => {
    addPart = jest.fn();
    component = shallow(<BikeEdit {...props} addPart={addPart} />);
  });
  test('should display add part when function is passed', () => {
    expect(findDataTest(component, 'reset-bike')).toHaveLength(0);
    expect(findDataTest(component, 'save-bike')).toHaveLength(0);
    expect(findDataTest(component, 'delete-bike')).toHaveLength(1);
    expect(findDataTest(component, 'add-bike-part')).toHaveLength(1);
  });
  test('should call the add function when the icon is clicked', () => {
    findDataTest(component, 'add-bike-part').simulate('click');
    expect(addPart).toHaveBeenCalledTimes(1);
  });
});
