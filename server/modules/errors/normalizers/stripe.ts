/**
 * Stripe error normalizer
 *
 * @function
 * @param {Error} error - GraphQL Error object from Apollo Server
 * @returns {Object} - { code, level } - A standardized error code and logger level
 */
export default error => {
  const errorInfo = { code: 'STRIPE', level: 'error' };

  switch (error.extensions.exception.type) {
    case 'StripeCardError':
      errorInfo.code = 'STRIPE_CARD';
      break;
    case 'RateLimitError':
      errorInfo.code = 'STRIPE_RATE_LIMIT';
      break;
    case 'StripeInvalidRequestError':
      errorInfo.code = 'STRIPE_INVALID_REQUEST';
      break;
    case 'StripeAPIError':
      errorInfo.code = 'STRIPE_API';
      break;
    case 'StripeConnectionError':
      errorInfo.code = 'STRIPE_CONNECTION';
      break;
    case 'StripeAuthenticationError':
      errorInfo.code = 'STRIPE_AUTHENTICATION';
      break;
    default:
      break;
  }

  return errorInfo;
};
