import { SELECTABLE_ROW_KEY } from "./table.types";
import { augmentRowsWithSelectable } from "./table.utils";

describe('augmentRowsWithSelectable', () => {
    it('should marks all rows selectable when no function is provided', () => {
        const rows = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
        const result = augmentRowsWithSelectable(rows);
        result.forEach((r) => expect((r as any)[SELECTABLE_ROW_KEY]).toBe(true));
    });

    it('should applies selectableFn to determine selectable rows', () => {
        const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const result = augmentRowsWithSelectable(rows, (row) => (row as any).id % 2 === 1);
        expect(result.map((r) => (r as any)[SELECTABLE_ROW_KEY])).toEqual([true, false, true]);
    });

    it('should marks all rows selectable when null is provided instead of function', () => {
        const rows = [{ key: 'x' }, { key: 'y' }];
        const result = augmentRowsWithSelectable(rows, null);
        result.forEach((r) => expect((r as any)[SELECTABLE_ROW_KEY]).toBe(true));
    });
});