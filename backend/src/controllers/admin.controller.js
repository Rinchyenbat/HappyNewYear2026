import { LoginLog } from '../models/LoginLog.js';
import { Message } from '../models/Message.js';
import { PendingFacebookLogin } from '../models/PendingFacebookLogin.js';
import { User } from '../models/User.js';

export async function listLoginLogs(req, res) {
  const logs = await LoginLog.find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .populate({ path: 'user', select: { username: 1, facebookId: 1, role: 1 } })
    .lean();

  res.status(200).json({
    logs: logs.map((l) => ({
      id: String(l._id),
      facebookId: l.facebookId,
      user: l.user
        ? {
            id: String(l.user._id),
            username: l.user.username,
            facebookId: l.user.facebookId,
            role: l.user.role
          }
        : null,
      success: l.success,
      reason: l.reason ?? null,
      ip: l.ip ?? null,
      userAgent: l.userAgent ?? null,
      createdAt: l.createdAt
    }))
  });
}

export async function listAllMessages(req, res) {
  const messages = await Message.find({})
    .sort({ createdAt: -1 })
    .limit(1000)
    .populate({ path: 'sender', select: { username: 1, facebookId: 1, role: 1 } })
    .populate({ path: 'receiver', select: { username: 1, facebookId: 1, role: 1 } })
    .lean();

  res.status(200).json({
    messages: messages.map((m) => ({
      id: String(m._id),
      sender: m.sender
        ? {
            id: String(m.sender._id),
            username: m.sender.username,
            facebookId: m.sender.facebookId,
            role: m.sender.role
          }
        : null,
      receiver: m.receiver
        ? {
            id: String(m.receiver._id),
            username: m.receiver.username,
            facebookId: m.receiver.facebookId,
            role: m.receiver.role
          }
        : null,
      content: m.content,
      isAnonymous: m.isAnonymous,
      createdAt: m.createdAt
    }))
  });
}

export async function listPendingFacebookLogins(req, res) {
  const pending = await PendingFacebookLogin.find({ status: 'pending' })
    .sort({ lastSeenAt: -1 })
    .limit(500)
    .lean();

  res.json({
    pending: pending.map((p) => ({
      id: String(p._id),
      facebookId: p.facebookId,
      facebookName: p.facebookName ?? null,
      firstSeenAt: p.firstSeenAt,
      lastSeenAt: p.lastSeenAt,
      seenCount: p.seenCount,
      lastIp: p.lastIp ?? null,
      lastUserAgent: p.lastUserAgent ?? null
    }))
  });
}

export async function approvePendingFacebookLogin(req, res) {
  const facebookId = String(req.body?.facebookId ?? '').trim();
  const username = String(req.body?.username ?? '').trim();

  if (!facebookId) return res.status(400).json({ message: 'facebookId is required' });
  if (!username) return res.status(400).json({ message: 'username is required' });

  const existingUser = await User.findOne({ facebookId }).select({ _id: 1, username: 1, role: 1 }).lean();
  if (existingUser) {
    await PendingFacebookLogin.updateOne(
      { facebookId },
      { $set: { status: 'approved', assignedUsername: existingUser.username, approvedAt: new Date() } }
    );
    return res.json({ status: 'already-approved', userId: String(existingUser._id), username: existingUser.username });
  }

  const usernameTaken = await User.exists({ username });
  if (usernameTaken) return res.status(409).json({ message: 'username is already in use' });

  const created = await User.create({ facebookId, username, role: 'user' });
  await PendingFacebookLogin.updateOne(
    { facebookId },
    { $set: { status: 'approved', assignedUsername: username, approvedAt: new Date() } },
    { upsert: true }
  );

  return res.json({ status: 'approved', userId: String(created._id), username: created.username });
}
