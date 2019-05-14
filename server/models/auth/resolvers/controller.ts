import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import config from 'config';
import addHours from 'date-fns/add_hours';
import generateCode from '../../../modules/code';
import { InternalError } from '../../../modules/errors';
import logger from '../../../modules/logger';
import mailer, {
  WELCOME_EMAIL,
  CONFIRMATION_EMAIL,
  UNLOCK_ACCOUNT_EMAIL,
} from '../../../modules/mailer';
import * as fragments from '../fragments';

/**
 * Registers a new user
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Object} - { token }
 */
const registerUser = async (parent, args, context, info): Promise<any> => {
  const role = await context.prisma.role({ name: 'USER' });

  logger.info('AUTH-RESOLVER: Hashing password');
  const password = await argon2.hash(args.input.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  logger.info('AUTH-RESOLVER: Creating user');
  const user = await context.prisma
    .createUser({
      role: { connect: { id: role.id } },
      firstName: args.input.firstName,
      lastName: args.input.lastName,
      email: args.input.email,
      password,
      userAccount: {
        create: config.get('server.auth.confirmable')
          ? {
              confirmedCode: generateCode(),
              confirmedExpires: String(
                addHours(
                  new Date(),
                  config.get('server.auth.codes.expireTime.confirmed')
                )
              ),
            }
          : {},
      },
    })
    .$fragment(fragments.registerUserFragment);

  logger.info('AUTH-RESOLVER: Signing token');
  const token = jwt.sign(
    { cuid: user.id, role: user.role.name },
    config.get('server.auth.jwt.secret'),
    { expiresIn: config.get('server.auth.jwt.expireTime') }
  );

  const emailType = config.get('server.auth.confirmable')
    ? CONFIRMATION_EMAIL
    : WELCOME_EMAIL;

  logger.info({ emailType }, 'AUTH-RESOLVER: Sending email');
  await mailer.send(user, emailType);

  return {
    token,
  };
};

/**
 * Confirms a new user's account
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const confirmUser = async (parent, args, context, info): Promise<any> => {
  logger.info('AUTH-RESOLVER: Confirming account');
  const user = await context.prisma
    .updateUserAccount({
      data: {
        confirmed: true,
        confirmedCode: null,
        confirmedExpires: null,
      },
      where: {
        confirmedCode: args.input.code,
      },
    })
    .user();

  logger.info('AUTH-RESOLVER: Sending welcome email');
  await mailer.send(user, WELCOME_EMAIL);

  return null;
};

/**
 * Logs in a user
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Object} - { token }
 */
const loginUser = async (parent, args, context, info): Promise<any> => {
  const user = await context.prisma
    .user({ email: args.input.email })
    .$fragment(fragments.loginUserFragment);
  const passwordMatch = await argon2.verify(user.password, args.input.password);

  if (!user) {
    throw new InternalError('INVALID_CREDENTIALS');
  }

  await context.prisma.updateUserAccount({
    data: !passwordMatch
      ? {
          loginAttempts: user.userAccount.loginAttempts + 1,
          locked:
            user.userAccount.loginAttempts >=
            config.get('server.auth.lockable.maxAttempts'),
          lockedCode: generateCode(),
          lockedExpires: String(
            addHours(
              new Date(),
              config.get('server.auth.codes.expireTime.locked')
            )
          ),
        }
      : {
          lastVisit: new Date(),
          ip: context.req.ip,
          loginAttempts: 0,
          securityQuestionAttempts: 0,
        },
    where: {
      id: user.userAccount.id,
    },
  });

  if (!passwordMatch) {
    throw new InternalError('INVALID_CREDENTIALS');
  }

  logger.info('AUTH-RESOLVER: Signing token');
  const token = jwt.sign(
    { cuid: user.id, role: user.role.name },
    config.get('server.auth.jwt.secret'),
    { expiresIn: config.get('server.auth.jwt.expireTime') }
  );

  return {
    token,
  };
};

/**
 * Sets a user's security question answers
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const setUserSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const queue = [];
  const userAccount = await context.prisma
    .user({ id: args.input.userId })
    .userAccount()
    .$fragment(`{ id }`);

  if (!userAccount) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  logger.info("AUTH-RESOLVER: Setting user's security questions");
  for (const item of args.input.answers) {
    queue.push(
      context.prisma.createSecurityQuestionAnswer({
        userAccount: { connect: { id: userAccount.id } },
        userSecurityQuestion: { connect: { shortName: item.shortName } },
        answer: item.answer,
      })
    );
  }

  await Promise.all(queue);
  return null;
};

/**
 * Retrieve a user's security question answers
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {Array} - Answers array of answer objects
 */
const getUserSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  logger.info("AUTH-RESOLVER: Retrieving user's security question answers");

  const answers = await context.prisma
    .user({ id: args.input.userId })
    .userAccount()
    .securityQuestions()
    .$fragment(fragments.userSecurityQuestionAnswersFragment);

  if (!answers) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  return answers;
};

/**
 * Verify a user's security question answers
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const verifyUserSecurityQuestionAnswers = async (
  parent,
  args,
  context,
  info
): Promise<any> => {
  const shortNamesIn: any = [];
  const answersIn: any = [];
  const user = await context.prisma
    .user({ email: args.input.email })
    .$fragment(fragments.verifyUserSecurityQuestionAnswersFragment);

  if (!user) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  args.input.answers.forEach(item => {
    shortNamesIn.push(item.shortName);
    answersIn.push(item.answer);
  });

  logger.info("AUTH-RESOLVER: Verifying user's security answers");
  const answers = await context.prisma
    .user({ email: user.email })
    .userAccount()
    .securityQuestions({
      where: {
        AND: [
          { userSecurityQuestion: { shortName_in: shortNamesIn } },
          { answer_in: answersIn },
        ],
      },
    });

  if (config.get('server.auth.securityQuestions.number') !== answers.length) {
    await context.prisma.updateUserAccount({
      data: {
        securityQuestionAttempts: user.userAccount.securityQuestionAttempts + 1,
        locked:
          user.userAccount.securityQuestionAttempts >=
          config.get('server.auth.lockable.maxAttempts'),
        lockedCode: generateCode(),
        lockedExpires: String(
          addHours(
            new Date(),
            config.get('server.auth.codes.expireTime.locked')
          )
        ),
      },
      where: {
        id: user.userAccount.id,
      },
    });

    throw new InternalError('INVALID_SECURITY_QUESTIONS');
  }

  return null;
};

/**
 * Generate a reset of a user's password
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const resetPassword = async (parent, args, context, info): Promise<any> => {
  const userAccount = await context.prisma
    .user({ email: args.input.email })
    .userAccount()
    .$fragment(`{ id }`);

  if (!userAccount) {
    throw new InternalError('INVALID_USER_INPUT', { args });
  }

  logger.info("AUTH-RESOLVER: Preparing user's password for reset");
  await context.prisma.updateUserAccount({
    data: {
      resetPasswordCode: generateCode(),
      resetPasswordExpires: String(
        addHours(
          new Date(),
          config.get('server.auth.codes.expireTime.passwordReset')
        )
      ),
    },
    where: {
      id: userAccount.id,
    },
  });

  return null;
};

/**
 * Change a user's password
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const changePassword = async (parent, args, context, info): Promise<any> => {
  logger.info("AUTH-RESOLVER: Changing user's password");
  const password = await argon2.hash(args.input.password, {
    timeCost: 2000,
    memoryCost: 500,
  });

  const userAccount = await context.prisma
    .updateUserAccount({
      data: {
        resetPasswordCode: null,
        resetPasswordExpires: null,
      },
      where: {
        resetPasswordCode: args.input.code,
      },
    })
    .$fragment(`{ user { id } }`);

  await context.prisma.updateUser({
    data: { password },
    where: { id: userAccount.user.id },
  });

  return null;
};

/**
 * Unlock a user's account
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const unlockAccount = async (parent, args, context, info): Promise<any> => {
  logger.info('AUTH-RESOLVER: Unlocking account');
  await context.prisma.updateUserAccount({
    data: {
      locked: false,
      lockedCode: null,
      lockedExpires: null,
    },
    where: {
      lockedCode: args.input.code,
    },
  });

  return null;
};

/**
 * Send a specific kind of authentication-related email to a user
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const sendAuthEmail = async (parent, args, context, info): Promise<any> => {
  const user = await context.prisma.user({ email: args.input.email });
  const emailType = {
    CONFIRMATION_EMAIL,
    UNLOCK_ACCOUNT_EMAIL,
  };

  logger.info('AUTH-RESOLVER: Sending email to user');
  await mailer.send(user, emailType[args.input.type]);

  return null;
};

export default {
  Query: {
    getUserSecurityQuestionAnswers,
  },
  Mutation: {
    registerUser,
    confirmUser,
    loginUser,
    setUserSecurityQuestionAnswers,
    verifyUserSecurityQuestionAnswers,
    resetPassword,
    changePassword,
    unlockAccount,
    sendAuthEmail,
  },
};
