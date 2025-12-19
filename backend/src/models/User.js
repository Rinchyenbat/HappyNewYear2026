import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    instagramId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      immutable: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
