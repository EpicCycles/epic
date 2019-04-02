export const buildSearchCriteria = searchCriteria => {
    const keys = Object.keys(searchCriteria);
    if(keys.length > 0) {
        return `?${keys.map(key => `${key}=${searchCriteria[key]}`).join('&')}`;
    }
    return '';
};