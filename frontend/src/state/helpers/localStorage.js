export const getLocalStorage = key => {
  if (localStorage.hasOwnProperty(key)) {
    // get the key's value from localStorage
    const value = localStorage.getItem(key);

    // parse the localStorage string and setState
    if (value) return JSON.parse(value);
  }
};

export const setLocalStorage = (key, value) => {
  if (key && value) localStorage.setItem(key, JSON.stringify(value));
};
