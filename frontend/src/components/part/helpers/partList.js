import { buildPartString } from './part';

export const getDataList = (parts, brands, partType, brand) => {
  let partsToShow = parts;
  if (partType) partsToShow = parts.filter(part => part.partType === partType);
  if (brand) partsToShow = partsToShow.filter(part => part.brand === brand);

  return partsToShow.map(part => ({ id: part.id, dataValue: buildPartString(part, brands) }));
};
