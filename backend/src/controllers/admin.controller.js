import { LoginLog } from '../models/LoginLog.js';
import { Message } from '../models/Message.js';

export async function listLoginLogs(req, res) {
  const logs = await LoginLog.find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .populate({ path: 'user', select: { username: 1, instagramId: 1, role: 1 } })
    .lean();

  res.status(200).json({
    logs: logs.map((l) => ({
      id: String(l._id),
      instagramId: l.instagramId,
      user: l.user
        ? {
            id: String(l.user._id),
            username: l.user.username,
            instagramId: l.user.instagramId,
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
    .populate({ path: 'sender', select: { username: 1, instagramId: 1, role: 1 } })
    .populate({ path: 'receiver', select: { username: 1, instagramId: 1, role: 1 } })
    .lean();

  res.status(200).json({
    messages: messages.map((m) => ({
      id: String(m._id),
      sender: m.sender
        ? {
            id: String(m.sender._id),
            username: m.sender.username,
            instagramId: m.sender.instagramId,
            role: m.sender.role
          }
        : null,
      receiver: m.receiver
        ? {
            id: String(m.receiver._id),
            username: m.receiver.username,
            instagramId: m.receiver.instagramId,
            role: m.receiver.role
          }
        : null,
      content: m.content,
      isAnonymous: m.isAnonymous,
      createdAt: m.createdAt
    }))
  });
}
