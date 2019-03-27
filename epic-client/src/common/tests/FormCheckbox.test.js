import React from "react";
import FormCheckbox from "../FormCheckbox";
import {findDataTest} from "../../../test/assert";

describe('FormCheckbox', () => {
    it('should render when minimum values are passed', () => {
        const component = shallow(<FormCheckbox onChange={jest.fn()} fieldName={'name'} fieldLabel={'mylabel'}/>);
        expect(findDataTest(component, 'checkbox-label')).toHaveText('mylabel');
        expect(findDataTest(component, 'checkbox-input')).toHaveLength(1);
    });
    it('should call function with fieldname and false when true was initially passed', () => {
        const onChange = jest.fn();
        const component = shallow(<FormCheckbox
            onChange={onChange}
            fieldName={'name'}
            fieldLabel={'mylabel'}
            fieldValue={true}
        />);
        findDataTest(component, 'checkbox-input').simulate('change');
        expect(onChange).toHaveBeenCalledWith('name', false);
    })
    it('should call function with fieldname and true when false was initially passed', () => {
        const onChange = jest.fn();
        const component = shallow(<FormCheckbox
            onChange={onChange}
            fieldName={'name'}
            fieldLabel={'mylabel'}
            fieldValue={false}
        />);
        findDataTest(component, 'checkbox-input').simulate('change');
        expect(onChange).toHaveBeenCalledWith('name', true);
    })
    it('should call function with fieldname and true when no value was initially passed', () => {
        const onChange = jest.fn();
        const component = shallow(<FormCheckbox
            onChange={onChange}
            fieldName={'name'}
            fieldLabel={'mylabel'}
        />);
        findDataTest(component, 'checkbox-input').simulate('change');
        expect(onChange).toHaveBeenCalledWith('name', true);
    })
});
