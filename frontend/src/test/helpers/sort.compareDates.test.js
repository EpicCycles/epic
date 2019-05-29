import {compareDates} from "../../helpers/sort";

describe('compareDates', () => {
    it('should return 0 when the dates are the same', () => {
        const a = new Date(2012, 11, 20, 3, 0, 0);
        const b = new Date(2012, 11, 20, 3, 0, 0);
        expect(compareDates(a, b)).toBe(0);
    });
    it('should return 0 when neither date is provided', () => {
        const a = undefined;
        const b = undefined;
        expect(compareDates(a, b)).toBe(0);
    });
    it('should return negative when a is before b', () => {
        const a = new Date(2012, 11, 19, 3, 0, 0);
        const b = new Date(2012, 11, 20, 3, 0, 0);
        expect(compareDates(a, b) < 0).toBeTruthy();
    });
    it('should return positive when a is there but not b', () => {
        const a = new Date(2012, 11, 19, 3, 0, 0);
        const b = undefined;
        expect(compareDates(a, b) > 0).toBeTruthy();
    });
    it('should return negative when b is there but not a', () => {
        const a = undefined;
        const b = new Date(2012, 11, 19, 3, 0, 0);
        expect(compareDates(a, b) < 0).toBeTruthy();
    });
    it('should return negative when the a is after b', () => {
        const a = new Date(2012, 11, 21, 3, 0, 0);
        const b = new Date(2012, 11, 20, 3, 0, 0);
        expect(compareDates(a, b) > 0).toBeTruthy();
    });
});