import { User } from '../models/User.js';

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
