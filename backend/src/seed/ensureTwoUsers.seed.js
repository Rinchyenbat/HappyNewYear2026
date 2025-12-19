import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { User } from '../models/User.js';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const MONGODB_URI = requireEnv('MONGODB_URI');

const USERS_TO_ENSURE = [
  { instagramId: '61740588898', username: 'Ninjbadgar' },
  { instagramId: '6996374317', username: 'Usukhbayar' }
];

function isDuplicateKeyError(err) {
  return err?.code === 11000;
}

async function ensureUser({ instagramId, username }) {
  // 1) Do not modify existing users.
  const existingByInstagramId = await User.findOne({ instagramId }).select({ _id: 1, username: 1 }).lean();
  if (existingByInstagramId) {
    return {
      instagramId,
      status: 'already-exists',
      id: String(existingByInstagramId._id),
      username: existingByInstagramId.username
    };
  }

  // 2) Ensure we don't accidentally create a user with a username already used.
  const existingByUsername = await User.findOne({ username }).select({ _id: 1, instagramId: 1 }).lean();
  if (existingByUsername) {
    return {
      instagramId,
      status: 'username-conflict',
      message: `Username '${username}' is already used by instagramId=${existingByUsername.instagramId}`
    };
  }

  // 3) Create user (race-safe with duplicate key handling).
  try {
    const created = await User.create({ instagramId, username, role: 'user' });
    return { instagramId, status: 'created', id: String(created._id), username: created.username };
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      // Another process created it between our checks.
      const nowExists = await User.findOne({ instagramId })
        .select({ _id: 1, username: 1 })
        .lean();

      if (nowExists) {
        return {
          instagramId,
          status: 'already-exists',
          id: String(nowExists._id),
          username: nowExists.username
        };
      }

      return {
        instagramId,
        status: 'duplicate-key',
        message: 'Duplicate key error; user not created'
      };
    }

    throw err;
  }
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  const inserted = [];
  const skipped = [];
  const conflicts = [];

  for (const u of USERS_TO_ENSURE) {
    // eslint-disable-next-line no-await-in-loop
    const result = await ensureUser(u);
    if (result.status === 'created') inserted.push(result);
    else if (result.status === 'already-exists') skipped.push(result);
    else conflicts.push(result);
  }

  // Clear, explicit output as requested.
  // eslint-disable-next-line no-console
  console.log('[inserted users]');
  // eslint-disable-next-line no-console
  console.log(inserted.length ? JSON.stringify(inserted, null, 2) : 'none');

  // eslint-disable-next-line no-console
  console.log('[skipped users (already existing)]');
  // eslint-disable-next-line no-console
  console.log(skipped.length ? JSON.stringify(skipped, null, 2) : 'none');

  if (conflicts.length) {
    // eslint-disable-next-line no-console
    console.log('[conflicts]');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(conflicts, null, 2));
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
