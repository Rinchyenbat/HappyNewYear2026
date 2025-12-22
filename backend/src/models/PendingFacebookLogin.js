import mongoose from 'mongoose';

const pendingFacebookLoginSchema = new mongoose.Schema(
  {
    facebookId: { type: String, required: true, unique: true, index: true, trim: true },
    facebookName: { type: String, trim: true },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },

    assignedUsername: { type: String, trim: true },
    approvedAt: { type: Date },

    firstSeenAt: { type: Date, default: () => new Date(), immutable: true },
    lastSeenAt: { type: Date, default: () => new Date() },
    seenCount: { type: Number, default: 1 },

    lastIp: { type: String, trim: true },
    lastUserAgent: { type: String, trim: true }
  },
  {
    versionKey: false
  }
);

export const PendingFacebookLogin = mongoose.model('PendingFacebookLogin', pendingFacebookLoginSchema);
