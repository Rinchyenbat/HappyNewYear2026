import createError from 'http-errors';
import mongoose from 'mongoose';

import { Letter } from '../models/Letter.js';
import { User } from '../models/User.js';

export async function sendLetter(req, res) {
  const fromUserId = req.user.id;
  const toUsername = String(req.body.toUsername).trim();
  const title = req.body.title === undefined ? undefined : String(req.body.title).trim();
  const body = String(req.body.body).trim();
  const isAnonymous = req.body.isAnonymous === undefined ? false : Boolean(req.body.isAnonymous);

  const toUser = await User.findOne({ username: toUsername }).select({ _id: 1, username: 1 }).lean();
  if (!toUser) {
    throw createError(404, 'Recipient not found');
  }

  if (String(toUser._id) === fromUserId) {
    throw createError(400, 'Cannot send a letter to yourself');
  }

  const letter = await Letter.create({
    fromUser: fromUserId,
    toUser: toUser._id,
    title: title || undefined,
    body,
    isAnonymous,
    isRead: false
  });

  res.status(201).json({
    letter: {
      id: String(letter._id),
      to: { id: String(toUser._id), username: toUser.username },
      title: letter.title ?? null,
      body: letter.body,
      isAnonymous: Boolean(letter.isAnonymous),
      isRead: letter.isRead,
      createdAt: letter.createdAt
    }
  });
}

export async function inbox(req, res) {
  const me = req.user.id;

  const letters = await Letter.find({ toUser: me })
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({ path: 'fromUser', select: { username: 1, avatarId: 1 } })
    .lean();

  res.status(200).json({
    letters: letters.map((l) => ({
      id: String(l._id),
      from:
        l.isAnonymous === true
          ? { username: 'Anonymous' }
          : l.fromUser
            ? {
                id: String(l.fromUser._id),
                username: l.fromUser.username,
                avatarId: l.fromUser.avatarId
              }
            : null,
      title: l.title ?? null,
      body: l.body,
      isAnonymous: Boolean(l.isAnonymous),
      isRead: Boolean(l.isRead),
      createdAt: l.createdAt
    }))
  });
}

export async function sent(req, res) {
  const me = req.user.id;

  const letters = await Letter.find({ fromUser: me })
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({ path: 'toUser', select: { username: 1 } })
    .lean();

  res.status(200).json({
    letters: letters.map((l) => ({
      id: String(l._id),
      to: l.toUser ? { id: String(l.toUser._id), username: l.toUser.username } : null,
      title: l.title ?? null,
      isRead: Boolean(l.isRead),
      createdAt: l.createdAt
    }))
  });
}

export async function getLetter(req, res) {
  const me = req.user.id;
  const id = String(req.params.id);

  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'Invalid id');
  }

  const letter = await Letter.findById(id)
    .populate({ path: 'fromUser', select: { username: 1, avatarId: 1 } })
    .populate({ path: 'toUser', select: { username: 1 } })
    .lean();

  if (!letter) {
    throw createError(404, 'Letter not found');
  }

  const isSender = String(letter.fromUser?._id ?? letter.fromUser) === me;
  const isReceiver = String(letter.toUser?._id ?? letter.toUser) === me;

  // Only sender or receiver may access.
  if (!isSender && !isReceiver) {
    // Use 404 to avoid leaking existence.
    throw createError(404, 'Letter not found');
  }

  res.status(200).json({
    letter: {
      id: String(letter._id),
      from:
        letter.isAnonymous === true && isReceiver
          ? { username: 'Anonymous' }
          : letter.fromUser
            ? {
                id: String(letter.fromUser._id),
                username: letter.fromUser.username,
                avatarId: letter.fromUser.avatarId
              }
            : null,
      to: letter.toUser ? { id: String(letter.toUser._id), username: letter.toUser.username } : null,
      title: letter.title ?? null,
      body: letter.body,
      isAnonymous: Boolean(letter.isAnonymous),
      isRead: Boolean(letter.isRead),
      createdAt: letter.createdAt
    }
  });
}

export async function markRead(req, res) {
  const me = req.user.id;
  const id = String(req.params.id);

  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'Invalid id');
  }

  // Receiver-only: update only when current user is the recipient.
  const updated = await Letter.findOneAndUpdate(
    { _id: id, toUser: me },
    { $set: { isRead: true } },
    { new: true }
  )
    .populate({ path: 'fromUser', select: { username: 1, avatarId: 1 } })
    .populate({ path: 'toUser', select: { username: 1 } })
    .lean();

  if (!updated) {
    // Either not found, or user isn't receiver.
    throw createError(404, 'Letter not found');
  }

  // Receiver-only endpoint: hide sender username if anonymous.
  const from =
    updated.isAnonymous === true
      ? { username: 'Anonymous' }
      : updated.fromUser
        ? {
            id: String(updated.fromUser._id),
            username: updated.fromUser.username,
            avatarId: updated.fromUser.avatarId
          }
        : null;

  res.status(200).json({
    letter: {
      id: String(updated._id),
      from,
      to: updated.toUser ? { id: String(updated.toUser._id), username: updated.toUser.username } : null,
      title: updated.title ?? null,
      body: updated.body,
      isAnonymous: Boolean(updated.isAnonymous),
      isRead: Boolean(updated.isRead),
      createdAt: updated.createdAt
    }
  });
}
