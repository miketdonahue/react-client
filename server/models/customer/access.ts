import { allow } from 'graphql-shield';
import { isAuthenticated } from '@server/modules/access-rules';

/**
 * Access permissions for types and resolvers
 *
 * @returns {Object} - A Shield object for permission middleware
 */
export default {
  Mutation: {
    createCustomer: allow,
    updateCustomer: allow,
  },
  Customer: {
    '*': isAuthenticated,
  },
};
