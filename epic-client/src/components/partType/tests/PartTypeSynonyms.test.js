import React from 'react';
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
import PartTypeSynonyms from "../PartTypeSynonyms";

test("it displays synonyms", () => {
    const partTypeKey = 45;
    const synonyms = [
        { id: 1, name: "synonym 1" },
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    const component = shallow(<PartTypeSynonyms
        partTypeKey={partTypeKey}
        synonyms={synonyms}
    />);
    expect(component).toMatchSnapshot();
});
test("it adds a change to an existing element by id", () => {
    const partTypeKey = 45;
    const synonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    const handlePartTypeChange = jest.fn();
    const component = shallow(<PartTypeSynonyms
        partTypeKey={partTypeKey}
        synonyms={synonyms}
        handlePartTypeChange={handlePartTypeChange}
    />);
    component.instance().handleInputChange("name_21","new name");
    const expectedSynonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "new name", changed:true, error: false, error_detail:""},
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    expect(handlePartTypeChange.mock.calls.length).toBe(1);
    expect(handlePartTypeChange.mock.calls[0][0]).toEqual("synonyms_45");
    expect(handlePartTypeChange.mock.calls[0][1]).toEqual(expectedSynonyms);
});
test("it adds an error to an existing element by id", () => {
    const partTypeKey = 45;
    const synonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    const handlePartTypeChange = jest.fn();
    const component = shallow(<PartTypeSynonyms
        partTypeKey={partTypeKey}
        synonyms={synonyms}
        handlePartTypeChange={handlePartTypeChange}
    />);
    component.instance().handleInputChange("name_21","");
    const expectedSynonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "", changed:true, error: true, error_detail:"A value is required for the synonym"},
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    expect(handlePartTypeChange.mock.calls.length).toBe(1);
    expect(handlePartTypeChange.mock.calls[0][0]).toEqual("synonyms_45");
    expect(handlePartTypeChange.mock.calls[0][1]).toEqual(expectedSynonyms);
});
test("it adds a change to an existing element by key", () => {
    const partTypeKey = 45;
    const synonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    const handlePartTypeChange = jest.fn();
    const component = shallow(<PartTypeSynonyms
        partTypeKey={partTypeKey}
        synonyms={synonyms}
        handlePartTypeChange={handlePartTypeChange}
    />);
    component.instance().handleInputChange("name_dummy2","new name");
    const expectedSynonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "new name", changed:true, error: false, error_detail:""},
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    expect(handlePartTypeChange.mock.calls.length).toBe(1);
    expect(handlePartTypeChange.mock.calls[0][0]).toEqual("synonyms_45");
    expect(handlePartTypeChange.mock.calls[0][1]).toEqual(expectedSynonyms);
});
test("it adds new element when data keyed", () => {
    const partTypeKey = 45;
    const synonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "synonym 2" },
    ];
    const handlePartTypeChange = jest.fn();
    const component = shallow(<PartTypeSynonyms
        partTypeKey={partTypeKey}
        synonyms={synonyms}
        handlePartTypeChange={handlePartTypeChange}
    />);
    component.instance().handleInputChange("name_not_found","new one");
    const expectedSynonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    expect(handlePartTypeChange.mock.calls.length).toBe(1);
    expect(handlePartTypeChange.mock.calls[0][0]).toEqual("synonyms_45");
    expect(handlePartTypeChange.mock.calls[0][1]).toEqual(expectedSynonyms);
});
test("it converts a new element to a dummy key to add another", () => {
    const partTypeKey = 45;
    const synonyms = [
        { id: 1, name: "synonym 1" },
        { id: 21, name: "synonym 21" },
        { dummyKey: 'dummy2', name: "synonym 2" },
        { dummyKey: NEW_ELEMENT_ID, name: "new one" }
    ];
    const handlePartTypeChange = jest.fn();
    const component = shallow(<PartTypeSynonyms
        partTypeKey={partTypeKey}
        synonyms={synonyms}
        handlePartTypeChange={handlePartTypeChange}
    />);
    component.instance().addAnother();
    expect(handlePartTypeChange.mock.calls.length).toBe(1);
    expect(handlePartTypeChange.mock.calls[0][0]).toEqual("synonyms_45");
    expect(handlePartTypeChange.mock.calls[0][1].length).toEqual(synonyms.length);
    expect(handlePartTypeChange.mock.calls[0][1][3].dummyKey).not.toEqual(NEW_ELEMENT_ID);
    expect(handlePartTypeChange.mock.calls[0][1][3].name).toEqual(synonyms[3].name);

});
