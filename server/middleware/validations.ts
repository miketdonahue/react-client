import path from 'path';
import { shield } from 'graphql-shield';
import assign from 'assign-deep';
import config from '@config';
import fileLoader from '../../utils/node-file-loader';

const validationsArray = fileLoader(
  path.join(process.cwd(), config.server.dirs.validations)
);

/**
 * Create input validations
 *
 * @function
 * @returns {Function} - A Shield function generator to be used as middleware
 */
export default shield(assign(...validationsArray));
