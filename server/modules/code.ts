/**
 * Generates a random length integer
 *
 * @function
 * @param {Integer} - The length of the generated integer
 * @returns {Integer}
 */
export default (length = 8) => {
  const date = +new Date();
  const timestamp = date.toString();
  const timestampParts = timestamp.split('').reverse();
  let code = '';

  for (let i = 0; i < length; ++i) {
    const index =
      Math.floor(Math.random() * (timestampParts.length - 1 - 0 + 1)) + 0;

    code += timestampParts[index];
  }

  return Number(code);
};
