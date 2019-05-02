import {gridItemClass} from "../display";

describe('display.gridItemClass', () => {
    it('should show just the grid header when required', () => {
        expect(gridItemClass('', 0, false)).toEqual(' grid-item ');
        expect(gridItemClass('', 1, true)).toEqual(' grid-item ');
    });
    it('should show a locked first column when required', () => {
        expect(gridItemClass('', 0, true)).toEqual(' grid-item grid-item--fixed-left');
    });
    it('should include a className when passed', () => {
        expect(gridItemClass('red', 0, false)).toEqual('red grid-item ');
        expect(gridItemClass('blue', 1, true)).toEqual('blue grid-item ');
        expect(gridItemClass('green', 0, true)).toEqual('green grid-item grid-item--fixed-left');
    });
});