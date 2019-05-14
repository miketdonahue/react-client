/**
 * SparkPost error normalizer
 *
 * @function
 * @param {Error} error - GraphQL Error object from Apollo Server
 * @returns {Object} - { code, level } - A standardized error code and logger level
 */
export default error => {
  const errorInfo = { code: 'SPARKPOST', level: 'error' };

  switch (error.extensions.exception.statusCode) {
    case 400:
      errorInfo.code = 'SPARKPOST_BAD_REQUEST';
      break;
    case 401:
      errorInfo.code = 'SPARKPOST_UNAUTHORIZED';
      break;
    case 403:
      errorInfo.code = 'SPARKPOST_FORBIDDEN';
      break;
    case 404:
      errorInfo.code = 'SPARKPOST_NOT_FOUND';
      break;
    case 405:
      errorInfo.code = 'SPARKPOST_NO_METHOD';
      break;
    case 409:
      errorInfo.code = 'SPARKPOST_CONFLICT';
      break;
    case 415:
      errorInfo.code = 'SPARKPOST_MEDIA_TYPE';
      break;
    case 422:
      errorInfo.code = 'SPARKPOST_UNPROCESSABLE';
      break;
    case 429:
      errorInfo.code = 'SPARKPOST_SENDING_LIMIT';
      break;
    case 500:
      errorInfo.code = 'SPARKPOST_INTERNAL';
      break;
    case 503:
      errorInfo.code = 'SPARKPOST_UNAVAILABLE';
      break;
    default:
      break;
  }

  return errorInfo;
};
