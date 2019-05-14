/**
 * JsonWebToken error normalizer
 *
 * @function
 * @param {Error} error - GraphQL Error object from Apollo Server
 * @returns {Object} - { code, level } - A standardized error code and logger level
 */ export default error => {
  const errorInfo = { code: 'JWT', level: 'error' };

  switch (error.extensions.exception.name) {
    case 'JsonWebTokenError':
      errorInfo.code = 'JWT_INVALID';
      break;
    case 'TokenExpiredError':
      errorInfo.code = 'JWT_EXPIRED';
      errorInfo.level = 'warn';
      break;
    default:
      break;
  }

  return errorInfo;
};
