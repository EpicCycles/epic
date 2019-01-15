import React from 'react';
import UploadMappingPartTypes from "../../../../components/app/upload/UploadMappingPartTypes";
import {renumberAll} from "../../../../helpers/framework";

const foundName = "find me";

const sections = [
    {
        id: 1,
        partTypes: [
            { includeInSection: 1, id: 11, shortName: "id 11" },
            { includeInSection: 1, id: 21, shortName: "id 21" },
        ]
    },
    {
        id: 2,
        partTypes: [
            { includeInSection: 2, id: 2, shortName: foundName },
            { includeInSection: 2, id: 22, shortName: "id 22" },
        ]
    },
];
const rowMappings = [
    { rowIndex: 1, partType: 2, partTypeName: foundName },
    { rowIndex: 2, partTypeName: "id 11", ignore: true },
    { rowIndex: 3, partTypeName: "id 11" },
    { rowIndex: 4, partTypeName: "id 111" },
    { rowIndex: 5, partTypeName: "id 234" },
    { rowIndex: 11, partType: 2, partTypeName: foundName },
];
let saveFramework = jest.fn();
let addDataAndProceed = jest.fn();
beforeEach(() => {
    saveFramework = jest.fn();
    addDataAndProceed = jest.fn();
});

test("it renders", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    expect(component).toMatchSnapshot();
});
test("It updates rowMappings with assigned part type", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    const expectedRowMappings = [
        { rowIndex: 1, partType: 2, partTypeName: foundName },
        { rowIndex: 2, partTypeName: "id 11", ignore: true },
        { rowIndex: 3, partTypeName: "id 11" },
        { rowIndex: 4, partTypeName: "id 111", partType: 11, ignore: false },
        { rowIndex: 5, partTypeName: "id 234" },
        { rowIndex: 11, partType: 2, partTypeName: foundName },
    ];
    component.instance().updateMapping(4, 11);
    expect(component.state('rowMappings')).toEqual(expectedRowMappings);
});
test("It updates rowMappings to remove assigned part type", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    const expectedRowMappings = [
        { rowIndex: 1, partTypeName: foundName, ignore: false },
        { rowIndex: 2, partTypeName: "id 11", ignore: true },
        { rowIndex: 3, partTypeName: "id 11" },
        { rowIndex: 4, partTypeName: "id 111" },
        { rowIndex: 5, partTypeName: "id 234" },
        { rowIndex: 11, partType: 2, partTypeName: foundName },
    ];
    component.instance().undoMapping(1);
    expect(component.state('rowMappings')).toEqual(expectedRowMappings);
});
test("It updates rowMappings to mark a row as ignored", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    const expectedRowMappings = [
        { rowIndex: 1, partType: 2, partTypeName: foundName },
        { rowIndex: 2, partTypeName: "id 11", ignore: true },
        { rowIndex: 3, partTypeName: "id 11" },
        { rowIndex: 4, partTypeName: "id 111" },
        { rowIndex: 5, partTypeName: "id 234" },
        { rowIndex: 11, partTypeName: foundName, ignore: true },
    ];
    component.instance().discardData(11);
    expect(component.state('rowMappings')).toEqual(expectedRowMappings);
});
test("Part type modal set up for new part type", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    component.instance().setUpPartTypeModalForNewField({ rowIndex: 3, partTypeName: "id 11" });
    expect(component.state('partType')).toEqual({ shortName: "id 11", _detail: true });
    expect(component.state('showModal')).toBeTruthy();
});
test("Part Type Modal called for existing part", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    component.instance().setUpPartTypeModalForPart(0, 1);
    expect(component.state('partType')).toEqual({ includeInSection: 1, id: 21, shortName: "id 21", _detail: true });
    expect(component.state('showModal')).toBeTruthy();
});
test("save existing part type", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    const updatedPartType = { includeInSection: 1, id: 21, shortName: "id 21 updated", _detail: true };
    const updatedSections = renumberAll([
        {
            id: 1,
            partTypes: [
                { includeInSection: 1, id: 11, shortName: "id 11" },
                updatedPartType,
            ]
        },
        {
            id: 2,
            partTypes: [
                { includeInSection: 2, id: 2, shortName: foundName },
                { includeInSection: 2, id: 22, shortName: "id 22" },
            ]
        },
    ]);
    component.instance().savePartType(updatedPartType);
    expect(saveFramework.mock.calls.length).toBe(1);
    expect(saveFramework.mock.calls[0][0]).toEqual(updatedSections);
});
test("save new part type", () => {
    const component = shallow(<UploadMappingPartTypes
        rowMappings={rowMappings}
        sections={sections}
        saveFramework={saveFramework}
        addDataAndProceed={addDataAndProceed}
    />);
    const newPartType = { includeInSection: 2, dummyKey: "new", shortName: "id new", _detail: true };
    const updatedSections = renumberAll([
        {
            id: 1,
            partTypes: [
                { includeInSection: 1, id: 11, shortName: "id 11" },
                { includeInSection: 1, id: 21, shortName: "id 21" },
            ]
        },
        {
            id: 2,
            partTypes: [
                { includeInSection: 2, id: 2, shortName: foundName },
                { includeInSection: 2, id: 22, shortName: "id 22" },
                newPartType
            ]
        },
    ]);
    component.instance().savePartType(newPartType);
    expect(saveFramework.mock.calls.length).toBe(1);
    expect(saveFramework.mock.calls[0][0]).toEqual(updatedSections);
});
