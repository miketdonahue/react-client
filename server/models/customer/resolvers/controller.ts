import stripeSdk from 'stripe';
import logger from '@server/modules/logger';
import { InternalError, ExternalError } from '@server/modules/errors';

const stripe = stripeSdk(process.env.STRIPE);

/**
 * Create a new customer
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const createCustomer = async (parent, args, context, info): Promise<any> => {
  const user = await context.prisma.user({ id: args.input.userId });

  if (!user) {
    throw new InternalError('USER_NOT_FOUND');
  }

  try {
    logger.info('PAYMENT-RESOLVER: Creating new customer');
    const customer = await stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: `+${user.phoneCountryCode}${user.phone}`,
      address: {
        line1: user.address1,
        line2: user.address2,
        city: user.city,
        state: user.state,
        postal_code: user.postalCode,
        country: user.country,
      },
      metadata: { id: user.id },
    });

    return { ...customer };
  } catch (error) {
    throw new ExternalError(error, { source: 'Stripe' });
  }
};

/**
 * Update an existing customer
 *
 * @async
 * @function
 * @param {Object} parent - Parent resolver
 * @param {Object} args - User input arguments
 * @param {Object} context - Global resolver store
 * @param {AST} info - GraphQL metadata
 * @returns {null}
 */
const updateCustomer = async (parent, args, context, info): Promise<any> => {
  const customer = await context.prisma
    .customer({
      user: { id: args.input.userId },
    })
    .$fragment(`{ stripeId }`);

  if (!customer) {
    throw new InternalError('CUSTOMER_NOT_FOUND');
  }

  try {
    logger.info('CUSTOMER-RESOLVER: Updating customer');
    const updatedCustomer = await stripe.customers.update(customer.stripeId, {
      source: args.input.source,
    });

    return { ...updatedCustomer };
  } catch (error) {
    throw new ExternalError(error, { source: 'Stripe' });
  }
};

export default {
  Mutation: {
    createCustomer,
    updateCustomer,
  },
};
