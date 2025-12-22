# HappyNewYear2026 Backend

Node.js + Express + MongoDB (Mongoose) backend with:
- Instagram OAuth login (with DEV bypass)
- Developer-controlled Instagram ID whitelist
- Server-assigned usernames (users cannot pick usernames)
- Private messaging (anonymous supported)
- JWT auth + admin moderation endpoints

## Requirements
- Node.js 18+
- MongoDB running and reachable via `MONGODB_URI`

## Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Whitelist setup (required before login)
This backend only allows login for Instagram IDs present in the `AllowedInstagramUser` collection.

Recommended (dev): run the seed script:
```bash
node src/seed/allowedInstagramUsers.seed.js
```

Example (Mongo shell):
```js
use hn2026
db.allowedinstagramusers.insertOne({ instagram_id: "123456789", assigned_username: "some_username" })
```

## Login flow

### Dev mode (DEV_AUTH_BYPASS=true)
- The frontend redirects to `GET /auth/instagram/callback?instagram_id=...`
- Backend validates the `instagram_id` against `allowedinstagramusers`
- Backend issues a JWT and redirects back to the frontend `/login?token=...&username=...`

### Production mode (DEV_AUTH_BYPASS=false)
- The frontend redirects to `GET /auth/instagram`
- Backend redirects to Instagram OAuth
- Instagram redirects back to `GET /auth/instagram/callback?code=...`
- Backend exchanges code -> access_token -> profile, then validates whitelist, issues JWT, and redirects to frontend

## Authenticated requests
Use the returned JWT:
```bash
curl -s http://localhost:4000/users \
  -H 'Authorization: Bearer <TOKEN>'
```

## Admin endpoints
To make a user admin, update their `role` in MongoDB:
```js
db.users.updateOne({ username: "hn26_..." }, { $set: { role: "admin" } })
```

Then:
- `GET /admin/login-logs`
- `GET /admin/messages`
