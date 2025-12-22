import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema(
  {
    facebookId: { type: String, required: true, trim: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    success: { type: Boolean, required: true },
    reason: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true }
  },
  { timestamps: true }
);

loginLogSchema.index({ createdAt: -1 });

export const LoginLog = mongoose.model('LoginLog', loginLogSchema);
