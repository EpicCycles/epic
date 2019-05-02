export const logError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log('error response data:', error.response.data);
    console.log('error response status:', error.response.status);
    console.log('error response headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error);
  }
  console.log(error.config);
};

export const errorAsMessage = (error, defaultMessage) => {
  if (error.response) {
    return JSON.stringify(error.response.data);
  }
  logError(error);
  return defaultMessage;
};
