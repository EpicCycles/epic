import {FIRST_NAME_FIELD, ISSUED_DATE_FIELD, LAST_NAME_FIELD, NUMBER_TYPE_FIELD} from "../fields";
import {createEmptyModelWithDefaultFields} from "../model";

describe('model.createEmptyModelWithDefaultFields', () => {
    it('should return just a dummy key when no field have defaults', () => {
        const fields = [ISSUED_DATE_FIELD, LAST_NAME_FIELD, FIRST_NAME_FIELD];
        const generatedModelInstance = createEmptyModelWithDefaultFields(fields);
        expect(generatedModelInstance.keys()).toEqual(['dummyKey']);
        expect(generatedModelInstance.dummyKey).not.toBe(undefined);
    });
    it('should return a dummy key and default value when a field has a select with a default value', () => {
         const fields = [ISSUED_DATE_FIELD, NUMBER_TYPE_FIELD, LAST_NAME_FIELD, FIRST_NAME_FIELD];
        const generatedModelInstance = createEmptyModelWithDefaultFields(fields);
        expect(generatedModelInstance.keys()).toEqual(['dummyKey', 'number_type']);
        expect(generatedModelInstance.dummyKey).not.toBe(undefined);
        expect(generatedModelInstance.number_type).toBe('H');
    })
});