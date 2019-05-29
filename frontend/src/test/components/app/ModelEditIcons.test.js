import React from 'react';
import { Icon } from 'semantic-ui-react';
import ModelEditIcons from '../../../components/app/model/ModelEditIcons';
import { MODEL_NAME_MISSING } from '../../../components/app/model/helpers/error';
import { assertComponentHasExpectedProps } from '../../jest_helpers/assert';

describe('ModelEditIcons tests', () => {
  const model = {
    id: 23,
    model_text: 'model text here',
    customer_visible: true,
  };
  const modelWithChanges = {
    id: 23,
    model_text: 'model text here',
    customer_visible: true,
    changed: true,
  };
  const modelWithChangesAndErrors = {
    id: 23,
    model_text: 'model text here',
    customer_visible: true,
    changed: true,
    error_detail: { model_text: MODEL_NAME_MISSING },
  };
  const modelNoId = {
    model_text: 'model text here',
    customer_visible: true,
    changed: true,
  };

  it('shows no buttons when no model', () => {
    const modelSave = jest.fn();

    const input = shallow(<ModelEditIcons modelSave={modelSave} />);
    const saveIcon = input.find('#save-model');
    const deleteIcon = input.find('#delete-model');
    const resetIcon = input.find('#reset-model');
    expect(saveIcon).toHaveLength(1);
    expect(deleteIcon).toHaveLength(0);
    expect(resetIcon).toHaveLength(0);
    assertComponentHasExpectedProps(saveIcon, {
      disabled: true,
    });
  });
  it('shows the buttons when model with id and no changes are present', () => {
    const modelSave = jest.fn();
    const modelDelete = jest.fn();
    const modelReset = jest.fn();

    const input = shallow(
      <ModelEditIcons
        modelSave={modelSave}
        model={model}
        modelDelete={modelDelete}
        modelReset={modelReset}
      />,
    );
    expect(input.find(Icon)).toHaveLength(3);
    const saveIcon = input.find('#save-model');
    const deleteIcon = input.find('#delete-model');
    const resetIcon = input.find('#reset-model');
    expect(saveIcon).toHaveLength(1);
    expect(deleteIcon).toHaveLength(1);
    expect(resetIcon).toHaveLength(1);
    assertComponentHasExpectedProps(saveIcon, {
      disabled: true,
    });
    assertComponentHasExpectedProps(resetIcon, {
      disabled: true,
    });
    assertComponentHasExpectedProps(deleteIcon, {
      disabled: false,
    });
    input
      .find('#delete-model')
      .at(0)
      .simulate('click');
    expect(modelDelete.mock.calls).toHaveLength(1);
  });
  it('shows the buttons when model with id and changes are present', () => {
    const modelSave = jest.fn();
    const modelDelete = jest.fn();
    const modelReset = jest.fn();

    const input = shallow(
      <ModelEditIcons
        modelSave={modelSave}
        model={modelWithChanges}
        modelDelete={modelDelete}
        modelReset={modelReset}
      />,
    );
    expect(input.find(Icon)).toHaveLength(3);
    const saveIcon = input.find('#save-model');
    const deleteIcon = input.find('#delete-model');
    const resetIcon = input.find('#reset-model');
    expect(saveIcon).toHaveLength(1);
    expect(deleteIcon).toHaveLength(1);
    expect(resetIcon).toHaveLength(1);
    assertComponentHasExpectedProps(saveIcon, {
      disabled: false,
    });
    assertComponentHasExpectedProps(resetIcon, {
      disabled: false,
    });
    assertComponentHasExpectedProps(deleteIcon, {
      disabled: false,
    });
    saveIcon.at(0).simulate('click');
    expect(modelSave.mock.calls).toHaveLength(1);
  });
  it('shows the buttons when model with id, errors and changes are present', () => {
    const modelSave = jest.fn();
    const modelDelete = jest.fn();
    const modelReset = jest.fn();

    const input = shallow(
      <ModelEditIcons
        modelSave={modelSave}
        model={modelWithChangesAndErrors}
        modelDelete={modelDelete}
        modelReset={modelReset}
      />,
    );
    expect(input.find(Icon)).toHaveLength(3);
    const saveIcon = input.find('#save-model');
    const deleteIcon = input.find('#delete-model');
    const resetIcon = input.find('#reset-model');
    expect(saveIcon).toHaveLength(1);
    expect(deleteIcon).toHaveLength(1);
    expect(resetIcon).toHaveLength(1);
    assertComponentHasExpectedProps(saveIcon, {
      disabled: true,
    });
    assertComponentHasExpectedProps(resetIcon, {
      disabled: false,
    });
    assertComponentHasExpectedProps(deleteIcon, {
      disabled: false,
    });
  });
  it('shows the buttons when model no id and changes are present', () => {
    const modelSave = jest.fn();
    const modelReset = jest.fn();

    const input = shallow(
      <ModelEditIcons
        modelSave={modelSave}
        model={modelNoId}
        modelReset={modelReset}
      />,
    );
    expect(input.find(Icon)).toHaveLength(2);
    const saveIcon = input.find('#save-model');
    const deleteIcon = input.find('#delete-model');
    const resetIcon = input.find('#reset-model');
    expect(saveIcon).toHaveLength(1);
    expect(deleteIcon).toHaveLength(0);
    expect(resetIcon).toHaveLength(1);
    assertComponentHasExpectedProps(saveIcon, {
      disabled: false,
    });
    assertComponentHasExpectedProps(resetIcon, {
      disabled: false,
    });
    resetIcon.at(0).simulate('click');
    expect(modelReset.mock.calls).toHaveLength(1);
  });
});
