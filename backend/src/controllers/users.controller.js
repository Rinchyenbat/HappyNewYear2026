import { User } from '../models/User.js';

const ALLOWED_AVATAR_IDS = [
  'penguin',
  'polar-bear',
  'rabbit',
  'cat',
  'fox',
  'deer',
  'owl',
  'seal',
  'wolf',
  'dog',
  'panda',
  'koala',
  'tiger',
  'lion',
  'elephant',
  'giraffe',
  'zebra',
  'monkey',
  'raccoon',
  'squirrel',
  'hedgehog',
  'otter',
  'dolphin',
  'whale',
  'crocodile',
  'frog',
  'turtle',
  'chick',
  'cow',
  'horse'
];

const DEFAULT_AVATAR_ID = 'penguin';

function normalizeAvatarId(value) {
  const v = String(value ?? '').trim();
  return ALLOWED_AVATAR_IDS.includes(v) ? v : DEFAULT_AVATAR_ID;
}

export async function listUsers(req, res) {
  const me = req.user.id;

  const users = await User.find({ _id: { $ne: me }, role: { $ne: 'admin' } })
    .select({ username: 1 })
    .sort({ username: 1 })
    .lean();

  res.status(200).json({
    users: users.map((u) => ({ id: String(u._id), username: u.username }))
  });
}

export async function getMyProfile(req, res) {
  const me = req.user.id;

  const user = await User.findById(me).select({ username: 1, role: 1, avatarId: 1 }).lean();

  if (!user) {
    return res.status(401).json({ error: { message: 'User not found' } });
  }

  const avatarId = normalizeAvatarId(user.avatarId);

  // Auto-migrate any legacy/invalid avatarId so the UI never sees a broken value.
  if (avatarId !== (user.avatarId ?? DEFAULT_AVATAR_ID)) {
    await User.updateOne({ _id: me }, { $set: { avatarId } });
  }

  return res.status(200).json({
    user: {
      id: String(user._id),
      username: user.username,
      role: user.role,
      avatarId
    }
  });
}

export async function updateMyProfile(req, res) {
  const me = req.user.id;
  const avatarId = String(req.body.avatarId ?? '').trim();

  if (!ALLOWED_AVATAR_IDS.includes(avatarId)) {
    return res.status(400).json({ error: { message: 'Invalid avatarId' } });
  }

  const user = await User.findByIdAndUpdate(
    me,
    { $set: { avatarId } },
    { new: true, runValidators: true, select: { username: 1, role: 1, avatarId: 1 } }
  ).lean();

  if (!user) {
    return res.status(401).json({ error: { message: 'User not found' } });
  }

  return res.status(200).json({
    user: {
      id: String(user._id),
      username: user.username,
      role: user.role,
      avatarId: normalizeAvatarId(user.avatarId)
    }
  });
}
