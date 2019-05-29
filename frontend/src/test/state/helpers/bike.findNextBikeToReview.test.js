import { findNextBikeToReview } from '../../../state/helpers/bike';

test('should return the next id when there are more items', () => {
  const reviewList = [11, 23, 3, 499];
  expect(findNextBikeToReview(reviewList, 3)).toBe(499);
});
test('should return undefined when there are no more items', () => {
  const reviewList = [11, 23, 3, 499];
  expect(findNextBikeToReview(reviewList, 499)).toBe(undefined);
});
test('should return undefined when there are items in review list', () => {
  const reviewList = [];
  expect(findNextBikeToReview(reviewList, 11)).toBe(undefined);
});
