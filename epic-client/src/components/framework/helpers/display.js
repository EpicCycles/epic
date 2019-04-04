import {doWeHaveObjects} from "../../../helpers/utils";

export const sectionHasDetail = (section, objectsToCheck) => {
    if (! (section && section.partTypes)) return false;
    if (! doWeHaveObjects(objectsToCheck)) return false;

    return section.partTypes.some(partType => {
        return objectsToCheck.some(objectToCheck => objectToCheck.partType = partType.id);
    })
};