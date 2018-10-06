import React from 'react';
import AttributeOptions from "../../../containers/framework/AttributeOptions";

describe("AttributeOptions tests", () => {

    const attributeId = 234;

    it("renders the form correctly with no options", () => {
        const input = shallow(
            <AttributeOptions options={[]} attributeId={attributeId}/>
        );
        expect(input).toMatchSnapshot();
    });
    it("renders the form correctly with options", () => {
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = shallow(
            <AttributeOptions options={options} attributeId={attributeId}/>
        );
        expect(input).toMatchSnapshot();
    });
    it("renders the form correctly when all options deleted", () => {
        const optionsDeleted = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze', delete: true },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: true },
            { part_type_attribute: 1, attribute_option: 'braze', dummyKey: 'hjgfkuyg34', delete: true },
        ];
        const input = shallow(
            <AttributeOptions options={optionsDeleted} attributeId={attributeId}/>
        );
        expect(input).toMatchSnapshot();
    });

    it("option update with id calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        expect(input).toMatchSnapshot();
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'Changed' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        input.find('#optionValue_123').simulate('change', { target: { id: 'optionValue_123', value: 'Changed' } });
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1]).toEqual(optionsAfterUpdate1);

        input.unmount();
    });

    it("option update with id when value is removed calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze', delete: true },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        input.find('#optionValue_123').simulate('change', { target: { id: 'optionValue_123' } });
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1]).toEqual(optionsAfterUpdate1);

        input.unmount();
    });
    it("option update with id when value is removed using the icon calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze', delete: true },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        input.find('#removeoptionValue_123').at(1).simulate('click');
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1]).toEqual(optionsAfterUpdate1);

        input.unmount();
    });
    it("option update with dummy key calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];

        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        expect(input).toMatchSnapshot();
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'Updated', dummyKey: 'hjgfkuyg34' },
        ];
        input.find('#optionValue_hjgfkuyg34').simulate('change', {
            target: {
                id: 'optionValue_hjgfkuyg34',
                value: 'Updated'
            }
        });
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1]).toEqual(optionsAfterUpdate1);

        input.unmount();
    });
    it("option update with dummy key when value is removed calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34', delete: true },
        ];
        input.find('#optionValue_hjgfkuyg34').simulate('change', {
            target: {
                id: 'optionValue_hjgfkuyg34',
                value: ''
            }
        });
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1]).toEqual(optionsAfterUpdate1);

        input.unmount();
    });
    it("option update with dummy key when value is removed using the icon calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34', delete: true },
        ];
        input.find('#removeoptionValue_hjgfkuyg34').at(1).simulate('click');
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1]).toEqual(optionsAfterUpdate1);

        input.unmount();
    });
    it("option update with dummy key calls parent method with right parameters", () => {
        const attributeLevelChange = jest.fn();
        const options = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        const input = mount(
            <AttributeOptions
                options={options}
                attributeKey={attributeId}
                handleAttributeChange={attributeLevelChange}
            />
        );
        expect(input).toMatchSnapshot();
        const optionsAfterUpdate1 = [
            { id: 123, part_type_attribute: 101, attribute_option: 'braze' },
            { id: 323, part_type_attribute: 101, attribute_option: 'band', delete: false },
            { part_type_attribute: 1, attribute_option: 'boggle', dummyKey: 'hjgfkuyg34' },
        ];
        input.find('#optionValue_new').simulate('change', { target: { id: 'optionValue_new', value: 'Updated' } });
        expect(attributeLevelChange.mock.calls.length).toBe(1);
        // The first arg of the first call to the function was 'first arg'
        expect(attributeLevelChange.mock.calls[0][0]).toBe(`options_${attributeId}`);

        // The second arg of the first call to the function was 'second arg'
        expect(attributeLevelChange.mock.calls[0][1].length).toBe(4);

        input.unmount();
    });

});