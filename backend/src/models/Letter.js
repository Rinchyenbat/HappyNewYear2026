import mongoose from 'mongoose';

const letterSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20000
    },
    isAnonymous: {
      type: Boolean,
      default: false,
      index: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

letterSchema.index({ toUser: 1, createdAt: -1 });
letterSchema.index({ fromUser: 1, createdAt: -1 });

export const Letter = mongoose.model('Letter', letterSchema);
