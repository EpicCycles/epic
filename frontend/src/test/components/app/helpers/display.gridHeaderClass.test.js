import {gridHeaderClass} from "../../../../components/app/model/helpers/display";

describe('display.gridHeaderClass', () => {
    it('should show just the grid header when required', () => {
        expect(gridHeaderClass('', 0, false)).toEqual(' grid-item--header ');
        expect(gridHeaderClass('', 1, true)).toEqual(' grid-item--header ');
    });
    it('should show a locked first column when required', () => {
        expect(gridHeaderClass('', 0, true)).toEqual(' grid-item--header grid-header--fixed-left');
    });
    it('should include a className when passed', () => {
        expect(gridHeaderClass('red', 0, false)).toEqual('red grid-item--header ');
        expect(gridHeaderClass('blue', 1, true)).toEqual('blue grid-item--header ');
        expect(gridHeaderClass('green', 0, true)).toEqual('green grid-item--header grid-header--fixed-left');
    });
});