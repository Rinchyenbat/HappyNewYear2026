# HappyNewYear2026 Backend

Node.js + Express + MongoDB (Mongoose) backend with:
- Facebook OAuth login (with DEV bypass)
- Pending-approval login flow (admin assigns usernames)
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

## Approval flow
This backend records Facebook logins and requires an admin to approve users and assign a username.

To bootstrap the first admin in production, set:
- `ADMIN_FACEBOOK_ID`
- `ADMIN_USERNAME` (optional, defaults to `admin`)

Admin endpoints:
- `GET /admin/pending-facebook-logins` (admin only)
- `POST /admin/pending-facebook-logins/approve` with JSON `{ "facebookId": "...", "username": "..." }`

## Login flow

### Dev mode (DEV_AUTH_BYPASS=true)
- The frontend redirects to `GET /auth/facebook/callback?facebook_id=...`
- Backend records the login and returns a token only if the user is approved
- Backend issues a JWT and redirects back to the frontend `/login?token=...&username=...`

### Production mode (DEV_AUTH_BYPASS=false)
- The frontend redirects to `GET /auth/facebook`
- Backend redirects to Facebook OAuth
- Facebook redirects back to `GET /auth/facebook/callback?code=...`
- Backend exchanges code -> access_token -> profile
- If approved, issues JWT and redirects to frontend
- If not approved, records a pending login and redirects to frontend with an error message

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
