import { User } from '../models/User.js';

const ALLOWED_AVATAR_IDS = [
  'firework',
  'sparkle',
  'party-hat',
  'lantern',
  'snowflake',
  'penguin-party',
  'polar-bear-party',
  'rabbit-party',
  'cat-confetti',
  'fox-scarf',
  'champagne-pop',
  'midnight-star'
];

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

  const user = await User.findById(me)
    .select({ username: 1, role: 1, avatarId: 1 })
    .lean();

  if (!user) {
    return res.status(401).json({ error: { message: 'User not found' } });
  }

  return res.status(200).json({
    user: {
      id: String(user._id),
      username: user.username,
      role: user.role,
      avatarId: user.avatarId ?? 'firework'
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
      avatarId: user.avatarId ?? 'firework'
    }
  });
}
