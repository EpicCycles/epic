import {formattedDateTime} from "../display";

describe('formattedDate', () => {

    it('should format a given date', () => {
        const startDate = new Date(2012, 11, 20, 3, 0, 0);
        expect(formattedDateTime(startDate)).toBe('12/20/2012, 3:00:00 AM');
    });
    it('should return an empty string when no date is passed', () => {
        expect(formattedDateTime()).toBe("");
    });
});