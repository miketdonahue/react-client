import logger from '@server/modules/logger';

/**
 * Resolver the "user account" relation
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {undefined} - User account relation was resolved
 */
const userAccount = async (parent, args, context, info): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving user account relation');
  return context.prisma.user({ email: parent.email }).userAccount();
};

/**
 * Resolver the "user" relation
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {undefined} - User relation was resolved
 */
const user = async (parent, args, context, info): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving user relation');
  return context.prisma.user({ where: { userAccount: { id: parent.id } } });
};

/**
 * Resolver the "security questions" relation
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {undefined} - Security questions relation was resolved
 */
const securityQuestions = async (parent, args, context, info): Promise<any> => {
  logger.info('USER-RESOLVER: Retrieving security questions relation');
  return context.prisma.securityQuestionAnswers({
    where: { userAccount: { user: { id: parent.id } } },
  });
};

export default {
  User: { userAccount },
  UserAccount: { user, securityQuestions },
};
