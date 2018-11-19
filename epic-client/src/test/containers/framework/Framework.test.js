import React from 'react';
import Framework from "../../../containers/framework/Framework";
import {NEW_ELEMENT_ID} from "../../../helpers/constants";
test('Framework displays and getFramework is called', () => {
    const sections = [];
    const getFramework = jest.fn();
    const saveFramework = jest.fn();
    const isLoading= false;

    const component = shallow(<Framework
        sections={sections}
        getFramework={getFramework}
        saveFramework={saveFramework}
        isLoading={isLoading}
    />);
    expect(component).toMatchSnapshot();
    expect(getFramework.mock.calls.length).toBe(1);
});
test('Framework displays and getFramework is not called', () => {
    const sections = [
        {id:23},
        {dummyKey:'dummy1'},
        {dummyKey:'dummy2', changed:true},
        {id:45, delete:true},
        {id:62, error:true, error_detail:"errors"},
        {dummyKey:NEW_ELEMENT_ID},
    ];
    const isLoading= false;

    const getFramework = jest.fn();
    const saveFramework = jest.fn();

    const component = shallow(<Framework
        sections={sections}
        getFramework={getFramework}
        saveFramework={saveFramework}
        isLoading={isLoading}
    />);
    expect(component).toMatchSnapshot();
    expect(getFramework.mock.calls.length).toBe(0);
});

