import logger from '@server/modules/logger';

/**
 * Updates a user
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Object} - A user object
 */
const updateUser = async (parent, args, context, info): Promise<any> => {
  logger.info('USER-RESOLVER: Updating user');
  const user = await context.prisma.updateUser({
    data: { ...args.input.data },
    where: { id: args.input.userId },
  });

  return { ...user };
};

export default {
  Mutation: {
    updateUser,
  },
};
