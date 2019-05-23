import jwt from 'jsonwebtoken';
import { rule } from 'graphql-shield';
import config from '@config';
import { ExternalError } from './errors';

/**
 * Checks if a user is authenticated
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Boolean} - If authenticated or not
 */
export const isAuthenticated = rule()(async (parent, args, context, info) => {
  // Skip authentication if auth is turned off
  if (!config.server.auth.enabled) {
    return true;
  }

  let token;
  const ctx = context;
  const { headers } = context.req;
  const headerParts =
    (headers.authorization && headers.authorization.split(' ')) || [];

  if (headerParts.length === 2) {
    const scheme = headerParts[0];
    const credentials = headerParts[1];

    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    }
  }

  return jwt.verify(
    token,
    config.server.auth.jwt.secret,
    { expiresIn: config.server.auth.jwt.expiresIn },
    (err, decoded) => {
      if (err) {
        return new ExternalError(err, { source: 'JsonWebToken' });
      }

      // Add the user to context for continued access
      ctx.user = decoded;
      return true;
    }
  );
});
