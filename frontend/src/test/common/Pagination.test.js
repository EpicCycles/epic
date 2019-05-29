import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Pagination from '../../common/pagination';

describe('Pagination tests', () => {
  it('renders the pagination correctly', () => {
    const pagination = shallow(<Pagination next="" previous="" count={1} getPage={jest.fn()} />);
    expect(toJson(pagination)).toMatchSnapshot();
    const icons = pagination.find('Icon');
    expect(icons).toHaveLength(4);
    icons.forEach(node => {
      expect(node.prop('disabled')).toBe(true);
    });
  });

  it('calls the page function when an icon is clicked', () => {
    const onPress = jest.fn();

    const pagination = shallow(<Pagination previous={2} count={3} next="" getPage={onPress} />);
    expect(pagination.find('#firstPage')).toHaveLength(1);
    pagination.find('#firstPage').simulate('click');
    expect(onPress).toBeCalledWith(1);
    expect(pagination.find('#nextPage').prop('disabled')).toBe(true);
    expect(pagination.find('#lastPage').prop('disabled')).toBe(true);
  });

  it('calls the prev page function when an icon is clicked', () => {
    const onPress = jest.fn();

    const pagination = shallow(<Pagination previous={2} count={3} next="" getPage={onPress} />);
    expect(pagination.find('#prevPage')).toHaveLength(1);
    pagination.find('#prevPage').simulate('click');
    expect(onPress).toBeCalledWith(2);
    expect(pagination.find('#firstPage').prop('disabled')).toBe(false);
    expect(pagination.find('#nextPage').prop('disabled')).toBe(true);
    expect(pagination.find('#lastPage').prop('disabled')).toBe(true);
  });

  it('calls the next page function when an icon is clicked', () => {
    const onPress = jest.fn();

    const pagination = shallow(<Pagination previous={1} count={5} next={3} getPage={onPress} />);
    expect(pagination.find('#nextPage')).toHaveLength(1);
    pagination.find('#nextPage').simulate('click');
    expect(onPress).toBeCalledWith(3);
    expect(pagination.find('#firstPage').prop('disabled')).toBe(false);
    expect(pagination.find('#prevPage').prop('disabled')).toBe(false);
    expect(pagination.find('#nextPage').prop('disabled')).toBe(false);
    expect(pagination.find('#lastPage').prop('disabled')).toBe(false);
  });
  it('calls the last page function when an icon is clicked', () => {
    const onPress = jest.fn();

    const pagination = shallow(<Pagination previous="" count={5} next={3} getPage={onPress} />);
    expect(pagination.find('#lastPage')).toHaveLength(1);
    pagination.find('#lastPage').simulate('click');
    expect(onPress).toBeCalledWith(99999);
    expect(pagination.find('#firstPage').prop('disabled')).toBe(true);
    expect(pagination.find('#prevPage').prop('disabled')).toBe(true);
    expect(pagination.find('#nextPage').prop('disabled')).toBe(false);
    expect(pagination.find('#lastPage').prop('disabled')).toBe(false);
  });
});
