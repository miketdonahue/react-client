import { allow } from 'graphql-shield';

/**
 * Access permissions for types and resolvers
 *
 * @returns {Object} - A Shield object for permission middleware
 */
export default {
  Mutation: {
    createCharge: allow,
  },
};
