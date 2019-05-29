import {removeItemFromArray} from "../../helpers/utils";

describe('utils.removeItemFromArray', () => {
    it('should leave an empty array unchanged', () => {
        expect(removeItemFromArray([], 23)).toEqual([]);
    });
    it('should leave an array unchanged when the id given does is not found', () => {
        const initialArray = [
            { id: 11 },
            { id: 21 },
            { id: 444 },
            { id: 16 },
        ];
        expect(removeItemFromArray(initialArray, 23)).toEqual(initialArray);
    });
    describe('tests where items are removed', () => {
        it('should remove the first object when the id is the first in the list', () => {
            const initialArray = [
                { id: 11 },
                { id: 21 },
                { id: 444 },
                { id: 16 },
            ];
            const finalArray = [
                { id: 21 },
                { id: 444 },
                { id: 16 },
            ];
            expect(removeItemFromArray(initialArray, 11)).toEqual(finalArray);
        });
        it('should remove the last bject when the id is the last in the list', () => {
            const initialArray = [
                { id: 11 },
                { id: 21 },
                { id: 444 },
                { id: 16 },
            ];
            const finalArray = [
                { id: 11 },
                { id: 21 },
                { id: 444 },
            ];
            expect(removeItemFromArray(initialArray, 16)).toEqual(finalArray);
        });
        it('should remove an object when the id is in the list', () => {
            const initialArray = [
                { id: 11 },
                { id: 21 },
                { id: 444 },
                { id: 16 },
            ];
            const finalArray = [
                { id: 11 },
                { id: 21 },
                { id: 16 },
            ];
            expect(removeItemFromArray(initialArray, 444)).toEqual(finalArray);
        });

    });
});