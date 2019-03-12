import React from 'react';
import ModelEditIcons from "../ModelEditIcons";
import {Icon} from "semantic-ui-react";
import {MODEL_NAME_MISSING} from "../helpers/error";

describe("ModelEditIcons tests", () => {
    const model = {
        id: 23,
        model_text: "model text here",
        customer_visible: true
    };
    const modelWithChanges = {
        id: 23,
        model_text: "model text here",
        customer_visible: true,
        changed: true
    };
    const modelWithChangesAndErrors = {
        id: 23,
        model_text: "model text here",
        customer_visible: true,
        changed: true,
        error_detail: { model_text: MODEL_NAME_MISSING }
    };
    const modelNoId = {
        model_text: "model text here",
        customer_visible: true,
        changed: true
    };

    it('shows no buttons when no model', () => {
        const modelSave = jest.fn();

        let input = shallow(
            <ModelEditIcons modelSave={modelSave}/>
        );
        expect(input.find(Icon).length).toBe(0);
    });
    it('shows the buttons when model with id and no changes are present', () => {
        const modelSave = jest.fn();
        const modelDelete = jest.fn();
        const modelReset = jest.fn();

        let input = shallow(
            <ModelEditIcons modelSave={modelSave} model={model} modelDelete={modelDelete}
                            modelReset={modelReset}/>
        );
        expect(input.find(Icon).length).toBe(1);
        expect(input.find("#delete-model").length).toBe(1);
        input.find("#delete-model").at(0).simulate("click");
        expect(modelDelete.mock.calls.length).toBe(1);
    });
    it('shows the buttons when model with id and changes are present', () => {
        const modelSave = jest.fn();
        const modelDelete = jest.fn();
        const modelReset = jest.fn();

        let input = shallow(
            <ModelEditIcons modelSave={modelSave} model={modelWithChanges} modelDelete={modelDelete}
                            modelReset={modelReset}/>
        );
        expect(input.find(Icon).length).toBe(3);
        expect(input.find("#save-model").length).toBe(1);
        expect(input.find("#reset-model").length).toBe(1);
        expect(input.find("#delete-model").length).toBe(1);
        input.find("#save-model").at(0).simulate("click");
        expect(modelSave.mock.calls.length).toBe(1);
    });
    it('shows the buttons when model with id, errors and changes are present', () => {
        const modelSave = jest.fn();
        const modelDelete = jest.fn();
        const modelReset = jest.fn();

        let input = shallow(
            <ModelEditIcons modelSave={modelSave} model={modelWithChangesAndErrors} modelDelete={modelDelete}
                            modelReset={modelReset}/>
        );
        expect(input.find(Icon).length).toBe(2);
        expect(input.find("#save-model").length).toBe(0);
        expect(input.find("#reset-model").length).toBe(1);
        expect(input.find("#delete-model").length).toBe(1);
    });
    it('shows the buttons when model no id and changes are present', () => {
        const modelSave = jest.fn();
        const modelDelete = jest.fn();
        const modelReset = jest.fn();

        let input = shallow(
            <ModelEditIcons modelSave={modelSave} model={modelNoId} modelDelete={modelDelete}
                            modelReset={modelReset}/>
        );
        expect(input.find(Icon).length).toBe(2);
        expect(input.find("#save-model").length).toBe(1);
        expect(input.find("#reset-model").length).toBe(1);
        input.find("#reset-model").at(0).simulate("click");
        expect(modelReset.mock.calls.length).toBe(1);
    });

});
