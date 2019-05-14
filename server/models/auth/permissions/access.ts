import { allow, and } from 'graphql-shield';
import {
  accountUnlocked,
  accountConfirmed,
  confirmationCodeNotExpired,
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
    confirmUser: confirmationCodeNotExpired,
    loginUser: and(accountConfirmed, accountUnlocked),
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
