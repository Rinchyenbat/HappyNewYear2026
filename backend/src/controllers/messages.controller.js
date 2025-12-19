import createError from 'http-errors';
import mongoose from 'mongoose';

import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

export async function sendMessage(req, res) {
  const senderId = req.user.id;
  const receiverId = String(req.body.receiver_id);
  const content = String(req.body.content).trim();
  const isAnonymous = req.body.is_anonymous === undefined ? false : req.body.is_anonymous;

  if (!mongoose.isValidObjectId(receiverId)) {
    throw createError(400, 'Invalid receiver_id');
  }
  if (receiverId === senderId) {
    throw createError(400, 'Cannot send message to yourself');
  }

  const receiver = await User.findById(receiverId).select({ _id: 1 }).lean();
  if (!receiver) {
    throw createError(404, 'Receiver not found');
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
    isAnonymous
  });

  res.status(201).json({
    message: {
      id: String(message._id),
      receiverId: String(message.receiver),
      content: message.content,
      isAnonymous: message.isAnonymous,
      createdAt: message.createdAt
    }
  });
}

export async function inbox(req, res) {
  const me = req.user.id;

  const messages = await Message.find({ receiver: me })
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({ path: 'sender', select: { username: 1 } })
    .lean();

  res.status(200).json({
    messages: messages.map((m) => ({
      id: String(m._id),
      content: m.content,
      isAnonymous: m.isAnonymous,
      sender: m.isAnonymous
        ? null
        : m.sender
          ? { id: String(m.sender._id), username: m.sender.username }
          : null,
      createdAt: m.createdAt
    }))
  });
}

export async function sent(req, res) {
  const me = req.user.id;

  const messages = await Message.find({ sender: me })
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({ path: 'receiver', select: { username: 1 } })
    .lean();

  res.status(200).json({
    messages: messages.map((m) => ({
      id: String(m._id),
      content: m.content,
      isAnonymous: m.isAnonymous,
      receiver: m.receiver
        ? { id: String(m.receiver._id), username: m.receiver.username }
        : null,
      createdAt: m.createdAt
    }))
  });
}
