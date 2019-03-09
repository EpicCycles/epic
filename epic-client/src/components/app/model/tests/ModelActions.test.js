import React from 'react';
import ModelActions from "../ModelActions";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../../test/assert";

describe('ModelActions', ()=> {
    it('should show Icon when an action is passed', () => {
        const actions = [
            {iconName:'edit', iconTitle:'edit model', iconAction: jest.fn(),}
        ];
        const component = shallow(<ModelActions actions={actions} componentKey={'thing'}/>);
        const iconList = findDataTest(component, "model-action");
        expect(iconList).toHaveLength(1);
        assertComponentHasExpectedProps(iconList, {
            name: 'edit',
            title: 'edit model',
            key: 'edit-thing'
        });
    });
});