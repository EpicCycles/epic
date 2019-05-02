import React from 'react';
import { Icon } from 'semantic-ui-react';
import ModelActions from '../ModelActions';
import {
  assertComponentHasExpectedProps,
  findDataTest,
} from '../../../../../../test/jest_helpers/assert';

describe('ModelActions', () => {
  it('should show Icon when an action is passed', () => {
    const actions = [{ iconName: 'edit', iconTitle: 'edit model', iconAction: jest.fn() }];
    const component = shallow(<ModelActions actions={actions} componentKey="thing" />);
    const iconList = findDataTest(component, 'model-action');
    expect(iconList).toHaveLength(1);
    assertComponentHasExpectedProps(iconList, {
      name: 'edit',
      title: 'edit model',
      key: 'edit-thing',
    });
  });

  it('should show multiple actions when they are passed', () => {
    const actions = [
      { iconName: 'edit', iconTitle: 'edit model', iconAction: jest.fn() },
      { iconName: 'view', iconTitle: 'view model', iconAction: jest.fn() },
      { iconName: 'delete', iconTitle: 'delete model', iconAction: jest.fn() },
    ];
    const component = shallow(<ModelActions actions={actions} componentKey="thing" />);
    const iconList = findDataTest(component, 'model-action');
    expect(iconList).toHaveLength(3);
  });

  it('should call the passed action with the component key when the icon is clicked', () => {
    const firstFunction = jest.fn();
    const secondFunction = jest.fn();
    const thirdFunction = jest.fn();
    const actions = [
      { iconName: 'edit', iconTitle: 'edit model', iconAction: firstFunction },
      { iconName: 'view', iconTitle: 'view model', iconAction: secondFunction },
      { iconName: 'delete', iconTitle: 'delete model', iconAction: thirdFunction },
    ];
    const component = shallow(<ModelActions actions={actions} componentKey="thing" />);
    component
      .find(Icon)
      .at(0)
      .simulate('click');
    expect(firstFunction.mock.calls).toHaveLength(1);
    expect(secondFunction.mock.calls).toHaveLength(0);
    expect(thirdFunction.mock.calls).toHaveLength(0);
    expect(firstFunction).toHaveBeenCalledWith('thing');
  });

  it('should not call the passed function when actions are disabled', () => {
    const firstFunction = jest.fn();
    const secondFunction = jest.fn();
    const thirdFunction = jest.fn();
    const actions = [
      { iconName: 'edit', iconTitle: 'edit model', iconAction: firstFunction },
      { iconName: 'view', iconTitle: 'view model', iconAction: secondFunction },
      { iconName: 'delete', iconTitle: 'delete model', iconAction: thirdFunction },
    ];
    const component = shallow(
      <ModelActions actions={actions} componentKey="thing" actionsDisabled />,
    );
    component
      .find(Icon)
      .at(0)
      .simulate('click');
    expect(firstFunction.mock.calls).toHaveLength(0);
    expect(secondFunction.mock.calls).toHaveLength(0);
    expect(thirdFunction.mock.calls).toHaveLength(0);
  });
});
