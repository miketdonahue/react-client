import { rule } from 'graphql-shield';
import isBefore from 'date-fns/is_before';
import { InternalError } from '@server/modules/errors';
import config from '@config';

/**
 * Checks if user account has been locked
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Error|Boolean}
 */
export const accountUnlocked = rule()(async (parent, args, context, info) => {
  if (!config.server.auth.lockable.enabled) {
    return true;
  }

  const userAccount = await context.prisma
    .user({
      email: args.input.email,
    })
    .userAccount();

  if (!userAccount) {
    return new InternalError('INVALID_USER_INPUT', { args });
  }

  if (userAccount.locked) {
    throw new InternalError('ACCOUNT_LOCKED');
  }

  return true;
});

/**
 * Checks if user account locked code has expired
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Error|Boolean}
 */
export const lockedCodeNotExpired = rule()(
  async (parent, args, context, info) => {
    const userAccount = await context.prisma.userAccount({
      lockedCode: args.input.code,
    });

    if (!userAccount) {
      throw new InternalError('CODE_NOT_FOUND', { code: 'lockedCode' });
    }

    if (isBefore(userAccount.lockedExpires, new Date())) {
      return new InternalError('LOCKED_CODE_EXPIRED');
    }

    return true;
  }
);

/**
 * Checks if user account reset password code has expired
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Error|Boolean}
 */
export const resetPasswordCodeNotExpired = rule()(
  async (parent, args, context, info) => {
    const userAccount = await context.prisma.userAccount({
      resetPasswordCode: args.input.code,
    });

    if (!userAccount) {
      throw new InternalError('CODE_NOT_FOUND', { code: 'resetPasswordCode' });
    }

    if (isBefore(userAccount.resetPasswordExpires, new Date())) {
      return new InternalError('RESET_PASSWORD_CODE_EXPIRED');
    }

    return true;
  }
);
