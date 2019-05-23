import logger from '@server/modules/logger';

/**
 * Resolver the "role" relation
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {undefined} - Role relation was resolved
 */
const role = async (parent, args, context, info): Promise<any> => {
  logger.info('ROLE-RESOLVER: Retrieving user role relation');
  return context.prisma.user({ email: parent.email }).role();
};

export default {
  User: { role },
};
