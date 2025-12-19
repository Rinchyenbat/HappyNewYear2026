import mongoose from 'mongoose';

const allowedInstagramIdSchema = new mongoose.Schema(
  {
    instagramId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AllowedInstagramID = mongoose.model('AllowedInstagramID', allowedInstagramIdSchema);
