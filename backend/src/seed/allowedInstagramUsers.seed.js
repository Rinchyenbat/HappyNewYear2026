import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { AllowedInstagramUser } from '../models/AllowedInstagramUser.js';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const MONGODB_URI = requireEnv('MONGODB_URI');

const PREDEFINED = [
  { instagram_id: '69734504876', assigned_username: 'Batnyam' },
  { instagram_id: '4185653541', assigned_username: 'Yura' },
  { instagram_id: '24262694499', assigned_username: 'Tegshbuyan' },
  { instagram_id: '8567928186', assigned_username: 'Munkhsaikhan' },
  { instagram_id: '25983395594', assigned_username: 'Badral' },
  { instagram_id: '47146044997', assigned_username: 'Munguntulga' },
  { instagram_id: '52390096072', assigned_username: 'Baljinnyam' },
  { instagram_id: '32255387386', assigned_username: 'Unubold' },
  { instagram_id: '61064986906', assigned_username: 'Tuguldur B' },
  { instagram_id: '7555030616', assigned_username: 'Urantsetseg' },
  { instagram_id: '24189462711', assigned_username: 'Javkhlan' },
  { instagram_id: '14780139285', assigned_username: 'Khurelsukh' },
  { instagram_id: '14737027031', assigned_username: 'Batbayar J' },
  { instagram_id: '54572258587', assigned_username: 'Saruulgerel' },
  { instagram_id: '8444461968', assigned_username: 'Altjin' },
  { instagram_id: '13951022145', assigned_username: 'Tugsbileg' },
  { instagram_id: '16601630481', assigned_username: 'Aiym' },
  { instagram_id: '29614071939', assigned_username: 'Bilguun E' },
  { instagram_id: '22648345584', assigned_username: 'Bindertsetseg' },
  { instagram_id: '4252304447', assigned_username: 'Munkhorgil' },
  { instagram_id: '61740588898', assigned_username: 'Ninjbadgar' },
  { instagram_id: '6996374317', assigned_username: 'Usukhbayar' }
];

async function main() {
  await mongoose.connect(MONGODB_URI);

  // Idempotent seeding: upsert by instagram_id, keep created_at only on insert.
  const ops = PREDEFINED.map((u) => ({
    updateOne: {
      filter: { instagram_id: u.instagram_id },
      update: {
        $set: { assigned_username: u.assigned_username },
        $setOnInsert: { created_at: new Date() }
      },
      upsert: true
    }
  }));

  const result = await AllowedInstagramUser.bulkWrite(ops, { ordered: true });

  // eslint-disable-next-line no-console
  console.log(
    `Seeded AllowedInstagramUser: upserted=${result.upsertedCount}, modified=${result.modifiedCount}`
  );

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
