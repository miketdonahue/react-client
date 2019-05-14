import path from 'path';
import config from 'config';
import { shield } from 'graphql-shield';
import assign from 'assign-deep';
import { fileLoader } from 'merge-graphql-schemas';

const validationsArray = fileLoader(
  path.join(process.cwd(), config.get('server.dirs.validations'))
);

/**
 * Create input validations
 *
 * @function
 * @returns {Function} - A Shield function generator to be used as middleware
 */
export default shield(assign(...validationsArray));
