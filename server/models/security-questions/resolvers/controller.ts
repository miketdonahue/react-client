import logger from '@server/modules/logger';

/**
 * Retrieves available security questions
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Array} - Array of security question objects
 */
const getSecurityQuestions = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  logger.info('SECURITY-QUESTION-RESOLVER: Retrieving security questions');
  return context.prisma.securityQuestions();
};

export default {
  Query: { getSecurityQuestions },
};
