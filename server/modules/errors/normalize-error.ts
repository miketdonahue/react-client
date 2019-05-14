import normalizers from './normalizers';

/**
 * Normalizes errors based on the incoming source
 *
 * @function
 * @param {Error} error - GraphQL error from Apollo Server
 * @returns {Function} - A normalizing function
 */
const normalizeError = (error): any => {
  let { source } = error.extensions.exception;

  // Some errors are not interceptable; Set a source here from some identifying property
  if (error.extensions.exception.name === 'ValidationError') {
    source = 'ValidationError';
  }

  switch (source) {
    case 'JsonWebToken':
      return normalizers.jwt(error);
    case 'SparkPost':
      return normalizers.sparkpost(error);
    case 'Stripe':
      return normalizers.stripe(error);
    case 'ValidationError':
      return normalizers.validation(error);
    case 'InternalError':
    default:
      return { code: error.extensions.code, level: 'error' };
  }
};

export default normalizeError;
