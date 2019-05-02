import React from 'react';
import { Icon } from 'semantic-ui-react';
import toJson from 'enzyme-to-json';
import { UploadMatchedPartType } from '../UploadMatchedPartType';

const foundName = 'find me';
const rowMappings = [
  { rowIndex: 1, partType: 2, partTypeName: foundName },
  { rowIndex: 2, partTypeName: 'id 11', ignore: true },
  { rowIndex: 3, partTypeName: 'id 11' },
  { rowIndex: 4, partTypeName: 'id 111' },
  { rowIndex: 5, partTypeName: 'id 234' },
  { rowIndex: 11, partType: 2, partTypeName: foundName },
];

const undoMapping = jest.fn();
describe('UploadMatchedPartType', () => {
  test('it renders', () => {
    const component = shallow(
      <UploadMatchedPartType matchIndex={0} matched={rowMappings[0]} undoMapping={undoMapping} />,
    );
    expect(toJson(component)).toMatchSnapshot();
    expect(component.find('div.red')).toHaveLength(0);
  });
  test('it renders red when not first match', () => {
    const component = shallow(
      <UploadMatchedPartType matchIndex={1} matched={rowMappings[5]} undoMapping={undoMapping} />,
    );
    expect(toJson(component)).toMatchSnapshot();
    expect(component.find('div.red')).toHaveLength(1);
  });
  test('it calls undoMapping with the row present when the Icon is clicked', () => {
    const component = shallow(
      <UploadMatchedPartType matchIndex={1} matched={rowMappings[5]} undoMapping={undoMapping} />,
    );
    expect(component.find('div.red')).toHaveLength(1);
    expect(component.find(Icon)).toHaveLength(1);

    component
      .find(Icon)
      .at(0)
      .simulate('click');
    expect(undoMapping.mock.calls).toHaveLength(1);
    expect(undoMapping.mock.calls[0][0]).toEqual(11);
  });
});
