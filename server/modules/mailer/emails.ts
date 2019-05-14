/**
 * New user welcome email options
 */
export const WELCOME_EMAIL = {
  campaignId: 'welcome',
  templateId: 'welcome',
  substitutionData: user => ({
    firstName: user.firstName,
  }),
};

/**
 * Confirmation email options
 */
export const CONFIRMATION_EMAIL = {
  campaignId: 'signup-confirmation',
  templateId: 'signup-confirmation',
  substitutionData: user => ({
    firstName: user.firstName,
    confirmedCode: user.userAccount.confirmedCode,
  }),
};

/**
 * Reset password email options
 */
export const RESET_PASSWORD_EMAIL = {
  campaignId: 'reset-password',
  templateId: 'reset-password',
  substitutionData: user => ({
    firstName: user.firstName,
    resetPasswordCode: user.userAccount.resetPasswordCode,
  }),
};

/**
 * Unlock account email options
 */
export const UNLOCK_ACCOUNT_EMAIL = {
  campaignId: 'unlock-account',
  templateId: 'unlock-account',
  substitutionData: user => ({
    firstName: user.firstName,
    lockedCode: user.userAccount.lockedCode,
  }),
};
