import { ApolloError } from 'apollo-server-express';
import errors from './constants';

interface InternalMeta {
  args?: object;
  code?: string;
}

interface ExternalMeta {
  source: string;
}

/**
 * Error class for application sourced errors
 *
 * @class
 * @param {String} type - A internal error constant
 * @param {Object} meta - Additional useful error metadata
 * @returns {Error} - ApolloError
 */
export class InternalError extends ApolloError {
  public constructor(type, meta?: InternalMeta) {
    const { message, code } = errors[type];
    const additionalProperties = Object.assign({}, errors[type].meta, {
      source: 'InternalError',
      ...meta,
    });

    super(message, code, additionalProperties);
  }
}

/**
 * Error class for third-party sourced errors
 *
 * @class
 * @param {Error} error - The third-party Error object
 * @param {Object} meta - Additional useful error metadata
 * @returns {Error} - ApolloError
 */
export class ExternalError extends ApolloError {
  public constructor(error, meta: ExternalMeta) {
    const { message, ...restOfProperties } = error;
    const additionalProperties = Object.assign(
      {},
      { ...meta, ...restOfProperties }
    );

    super(message, undefined, additionalProperties);
  }
}
