import React from 'react';
import toJson from 'enzyme-to-json';
import UploadMappingSuppliers from '../UploadMappingSuppliers';

const foundName = 'find me';
const suppliers = [
  { id: 1, supplier_name: 'id is 1' },
  { id: 2, supplier_name: foundName },
  { id: 3, supplier_name: 'id is 3' },
];
const rowMappings = [
  { rowIndex: 1, supplier: 2, supplierName: foundName },
  { rowIndex: 2, supplierName: 'id 11', ignore: true },
  { rowIndex: 3, supplierName: 'id 11' },
  { rowIndex: 4, supplierName: 'id 111' },
  { rowIndex: 5, supplierName: 'id 234' },
  { rowIndex: 11, supplier: 2, supplierName: foundName },
];
const saveSupplier = jest.fn();
const addDataAndProceed = jest.fn();

describe('UploadMappingSuppliers', () => {
  test('it renders', () => {
    const component = shallow(
      <UploadMappingSuppliers
        rowMappings={rowMappings}
        suppliers={suppliers}
        saveSupplier={saveSupplier}
        addDataAndProceed={addDataAndProceed}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  test('it sets up the supplierModal for a supplier', () => {
    const component = shallow(
      <UploadMappingSuppliers
        rowMappings={rowMappings}
        suppliers={suppliers}
        saveSupplier={saveSupplier}
        addDataAndProceed={addDataAndProceed}
      />,
    );
    component.instance().setUpSupplierModalForNewField({ rowIndex: 4, supplierName: 'id 111' });
    expect(component.state('showModal')).toBeTruthy();
    expect(component.state('supplier')).toEqual({ supplier_name: 'id 111' });
  });
  test('it marks a discarded row as ignore', () => {
    const component = shallow(
      <UploadMappingSuppliers
        rowMappings={rowMappings}
        suppliers={suppliers}
        saveSupplier={saveSupplier}
        addDataAndProceed={addDataAndProceed}
      />,
    );
    const rowMappingsExpected = [
      { rowIndex: 1, supplier: 2, supplierName: foundName },
      { rowIndex: 2, supplierName: 'id 11', ignore: true },
      { rowIndex: 3, supplierName: 'id 11' },
      { rowIndex: 4, supplierName: 'id 111' },
      { rowIndex: 5, supplierName: 'id 234' },
      { rowIndex: 11, supplierName: foundName, ignore: true },
    ];
    component.instance().discardData(11);
    expect(component.state('rowMappings')).toEqual(rowMappingsExpected);
  });
  test('it removes ignore when a row is removed from discard pile', () => {
    const component = shallow(
      <UploadMappingSuppliers
        rowMappings={rowMappings}
        suppliers={suppliers}
        saveSupplier={saveSupplier}
        addDataAndProceed={addDataAndProceed}
      />,
    );
    const rowMappingsExpected = [
      { rowIndex: 1, supplier: 2, supplierName: foundName },
      { rowIndex: 2, supplierName: 'id 11', ignore: false },
      { rowIndex: 3, supplierName: 'id 11' },
      { rowIndex: 4, supplierName: 'id 111' },
      { rowIndex: 5, supplierName: 'id 234' },
      { rowIndex: 11, supplier: 2, supplierName: foundName },
    ];

    component.instance().undoDiscardData(2);
    expect(component.state('rowMappings')).toEqual(rowMappingsExpected);
  });
  test('it calls passed method to save updated row mappings', () => {
    const component = shallow(
      <UploadMappingSuppliers
        rowMappings={rowMappings}
        suppliers={suppliers}
        saveSupplier={saveSupplier}
        addDataAndProceed={addDataAndProceed}
      />,
    );
    const rowMappingsExpected = [
      { rowIndex: 1, supplier: 2, supplierName: foundName },
      { rowIndex: 2, supplierName: 'id 11', ignore: false },
      { rowIndex: 3, supplierName: 'id 11' },
      { rowIndex: 4, supplierName: 'id 111' },
      { rowIndex: 5, supplierName: 'id 234' },
      { rowIndex: 11, supplier: 2, supplierName: foundName },
    ];

    component.instance().undoDiscardData(2);
    component.instance().goToNextStep();
    expect(addDataAndProceed.mock.calls).toHaveLength(1);
    expect(addDataAndProceed.mock.calls[0][0].rowMappings).toEqual(rowMappingsExpected);
  });
});
