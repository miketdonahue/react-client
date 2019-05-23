import { inputRule } from 'graphql-shield';
import {
  alpha,
  alphaNumeric,
  code,
  email,
} from '@server/modules/validation-rules';
import config from '@config';

const answers = (yup): any =>
  yup
    .array()
    .of(yup.object())
    .min(config.server.auth.securityQuestions.number);

/**
 * Input validations for types and resolvers
 *
 * @returns {Object} - A Shield object for validation middleware
 */
export default {
  Query: {
    getUserSecurityQuestionAnswers: inputRule(yup =>
      yup.object({
        input: yup.object({ userId: alphaNumeric }),
      })
    ),
  },
  Mutation: {
    registerUser: inputRule(yup =>
      yup.object({
        input: yup.object({ firstName: alpha, lastName: alpha, email }),
      })
    ),
    confirmUser: inputRule(yup =>
      yup.object({
        input: yup.object({
          code,
        }),
      })
    ),
    loginUser: inputRule(yup => yup.object({ input: yup.object({ email }) })),
    setUserSecurityQuestionAnswers: inputRule(yup =>
      yup.object({
        input: yup.object({
          email,
          answers: answers(yup),
        }),
      })
    ),
    verifyUserSecurityQuestionAnswers: inputRule(yup =>
      yup.object({
        input: yup.object({
          email,
          answers: answers(yup),
        }),
      })
    ),
    resetPassword: inputRule(yup =>
      yup.object({ input: yup.object({ email }) })
    ),
    changePassword: inputRule(yup =>
      yup.object({
        input: yup.object({
          code,
        }),
      })
    ),
    unlockAccount: inputRule(yup =>
      yup.object({
        input: yup.object({
          code,
        }),
      })
    ),
    sendAuthEmail: inputRule(yup =>
      yup.object({
        input: yup.object({
          email,
          type: yup
            .mixed()
            .oneOf(['CONFIRMATION_EMAIL', 'UNLOCK_ACCOUNT_EMAIL']),
        }),
      })
    ),
  },
};
