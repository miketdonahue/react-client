import { allow } from 'graphql-shield';
import {
  accountUnlocked,
  resetPasswordCodeNotExpired,
  lockedCodeNotExpired,
} from './resolvers';

/**
 * Access permissions for types and resolvers
 *
 * @returns {Object} - A Shield object for permission middleware
 */
export default {
  Query: {
    getUserSecurityQuestionAnswers: allow,
  },
  Mutation: {
    registerUser: allow,
    confirmUser: allow,
    loginUser: accountUnlocked,
    setUserSecurityQuestionAnswers: allow,
    verifyUserSecurityQuestionAnswers: accountUnlocked,
    resetPassword: allow,
    changePassword: resetPasswordCodeNotExpired,
    unlockAccount: lockedCodeNotExpired,
    sendAuthEmail: allow,
  },
  AuthPayload: {
    '*': allow,
  },
};
