import mongoose from 'mongoose';

// Developer-controlled whitelist + exact username mapping.
// NOTE: Field names intentionally match the spec (snake_case).
const allowedInstagramUserSchema = new mongoose.Schema(
  {
    instagram_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    assigned_username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    created_at: {
      type: Date,
      default: () => new Date(),
      immutable: true
    }
  },
  {
    versionKey: false
  }
);

export const AllowedInstagramUser = mongoose.model(
  'AllowedInstagramUser',
  allowedInstagramUserSchema,
  'allowedinstagramusers'
);
