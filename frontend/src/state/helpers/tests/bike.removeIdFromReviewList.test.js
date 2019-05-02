import {removeIdFromReviewList} from "../bike";

test('should remove the id when there are more items', () => {
    const reviewList = [11,23,3,499];
    expect(removeIdFromReviewList(reviewList, 3)).toEqual([11,23,499]);
});
test('should return an empty list when there is only one item', () => {
    const reviewList = [499];
    expect(removeIdFromReviewList(reviewList, 499)).toEqual([]);
});