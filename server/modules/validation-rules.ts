import * as yup from 'yup';

export const alpha = yup
  .string()
  .matches(/^[a-zA-Z'-.\s]+$/, 'Must contain letters only');
export const alphaNumeric = yup
  .string()
  .matches(/^[a-zA-Z0-9]+$/, 'Must contain letters and numbers only');
export const code = yup
  .number()
  .integer('Code must be an 8 digit integer')
  .min(8)
  .max(8);
export const email = yup.string().email('Invalid email address');
