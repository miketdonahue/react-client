/**
 * Validation error normalizer
 *
 * @function
 * @param {Error} error - GraphQL Error object from Apollo Server
 * @returns {Object} - { code, level } - A standardized error code and logger level
 */
export default error => {
  // eslint-disable-next-line no-param-reassign
  delete error.extensions.exception.value;

  return { code: 'VALIDATION_ERROR', level: 'warn' };
};
