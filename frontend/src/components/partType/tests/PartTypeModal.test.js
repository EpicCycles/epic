import React from 'react';
import toJson from 'enzyme-to-json';
import PartTypeModal from '../PartTypeModal';
import { PART_TYPE_NAME_MISSING, SECTION_MISSING } from '../../app/model/helpers/error';

const sections = [{ name: 'section 1', id: 1 }, { name: 'section 2', id: 2 }];
describe('PartTypeModal', () => {
  it('displays correctly with a new part', () => {
    const component = shallow(<PartTypeModal partTypeModalOpen sections={sections} />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('displays correctly with a partial new part', () => {
    const partType = {
      name: 'new one',
      _detail: true,
    };
    const component = shallow(
      <PartTypeModal partTypeModalOpen sections={sections} partType={partType} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  test('error when no short name', () => {
    const partType = {
      includeInSection: sections[0].id,
      name: 'has one one',
      id: '1',
      _detail: true,
    };
    const component = shallow(
      <PartTypeModal partTypeModalOpen sections={sections} partType={partType} />,
    );
    expect(toJson(component)).toMatchSnapshot();

    component.instance().handlePartTypeValueChange('name_1', '');
    const expectedData = Object.assign({}, partType, {
      name: '',
      changed: true,
      error: true,
      error_detail: PART_TYPE_NAME_MISSING,
    });
    expect(component.state('partType')).toEqual(expectedData);
  });
  test('error when no includeInSection', () => {
    const partType = {
      includeInSection: sections[0].id,
      name: 'has one one',
      id: '1',
      _detail: true,
    };
    const component = shallow(
      <PartTypeModal partTypeModalOpen sections={sections} partType={partType} />,
    );
    expect(toJson(component)).toMatchSnapshot();

    component.instance().handlePartTypeValueChange('includeInSection_1', '');
    const expectedData = Object.assign({}, partType, {
      includeInSection: '',
      changed: true,
      error: true,
      error_detail: SECTION_MISSING,
    });
    expect(component.state('partType')).toEqual(expectedData);
  });
});
