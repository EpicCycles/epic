export const compareDates = (a, b) => {
    if (a && b) {
        return a - b;
    }
    if (a) return 1;
    if(b) return -1;

  return 0;
};
export const compareDatesDescending = (a, b) => {
      return 0 - compareDates(a,b);
};