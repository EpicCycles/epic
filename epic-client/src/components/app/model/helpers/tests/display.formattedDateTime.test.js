import {formattedDate} from "../display";

describe('formattedDate', () => {

    it('should format a given date', () => {
        const startDate = new Date(2012, 11, 20, 3, 0, 0);
        expect(formattedDate(startDate)).toBe('12/20/2012');
    });
    it('should return an empty string when no date is passed', () => {
        expect(formattedDate()).toBe("");
    });
});