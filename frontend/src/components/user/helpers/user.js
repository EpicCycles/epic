import {findObjectWithId} from "../../../helpers/utils";

export const userName = (user) => {
    let displayArray = [];
    if (user.first_name) displayArray.push(user.first_name);
    if (user.last_name) displayArray.push(user.last_name);
    if (user.username) displayArray.push(`(${user.username})`);
    return displayArray.join(' ');
};
export const getUserName = (userId, users) => {
    const user = findObjectWithId(users, userId);
    if (user) return userName(user);
    return userId;
};
