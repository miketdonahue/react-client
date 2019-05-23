import path from 'path';
import { shield, deny } from 'graphql-shield';
import assign from 'assign-deep';
import config from '@config';
import { InternalError } from '@server/modules/errors';
import fileLoader from '../../utils/node-file-loader';

const permissionsArray = fileLoader(
  path.join(process.cwd(), config.server.dirs.access)
);

/**
 * Create access permissions
 *
 * @function
 * @returns {Function} - A Shield function generator to be used as middleware
 */
export default shield(assign(...permissionsArray), {
  debug: config.server.graphql.debug,
  fallbackRule: deny,
  fallbackError: new InternalError('UNAUTHORIZED'),
});
