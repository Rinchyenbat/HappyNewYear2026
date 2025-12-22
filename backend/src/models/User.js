import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    facebookId: {
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
    },
    avatarId: {
      type: String,
      required: true,
      default: 'firework',
      trim: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
