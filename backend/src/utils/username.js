import crypto from 'node:crypto';
import { User } from '../models/User.js';

function randomSuffix(length = 8) {
  // base64url is URL-safe and compact
  return crypto.randomBytes(Math.ceil((length * 3) / 4)).toString('base64url').slice(0, length);
}

export async function generateUniqueUsername() {
  // Developer-controlled pattern; no user input.
  // Example: hn26_ab12CD34
  const prefix = 'hn26_';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const username = `${prefix}${randomSuffix(8)}`;
    // Using exists() keeps it cheap.
    // eslint-disable-next-line no-await-in-loop
    const taken = await User.exists({ username });
    if (!taken) return username;
  }

  // Extremely unlikely; still fail safely.
  throw new Error('Failed to generate unique username');
}
