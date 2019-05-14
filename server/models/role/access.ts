import { isAuthenticated } from '../../modules/access-rules';

/**
 * Access permissions for types and resolvers
 *
 * @returns {Object} - A Shield object for permission middleware
 */
export default {
  Role: {
    '*': isAuthenticated,
  },
};
