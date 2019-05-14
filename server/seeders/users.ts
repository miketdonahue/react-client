/* eslint-disable no-await-in-loop */
import argon2 from 'argon2';
import config from 'config';
import addHours from 'date-fns/add_hours';
import { Chance } from 'chance';
import { prisma } from '../prisma/generated/prisma-client';
import generateCode from '../modules/code';

const chance = new Chance();
const numberOfUsers = 5;

/**
 * Seed users
 *
 * @async
 * @function
 * @returns {undefined} - Users were inserted into DB
 */
export default async () => {
  const password = await argon2.hash('Prisma123', {
    timeCost: 2000,
    memoryCost: 500,
  });

  for (let i = 0; i < numberOfUsers; i++) {
    const email = chance.email();
    const role = await prisma.role({ name: 'USER' });

    await prisma.createUser({
      role: { connect: { id: role.id } },
      firstName: chance.first(),
      lastName: chance.last(),
      email,
      password,
      phoneCountryCode: '1',
      phone: chance.phone({ formatted: false, country: 'us' }),
      country: 'United States',
      address1: chance.address(),
      city: chance.city(),
      state: chance.state(),
      postalCode: chance.zip(),
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
    });
  }
};
