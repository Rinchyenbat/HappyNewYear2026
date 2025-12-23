# HappyNewYear2026 Backend

Node.js + Express + MongoDB (Mongoose) backend with:
- Clerk-based login (Facebook-only in the frontend)
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

The frontend authenticates users via Clerk (Facebook OAuth). After Clerk sign-in, the frontend calls:

- `POST /auth/clerk/exchange` with `Authorization: Bearer <clerk_session_jwt>`

The backend verifies the Clerk JWT (via JWKS) and then:
- If the user is approved (exists in `users`), returns an app JWT for API calls.
- If not approved, records a pending login (`pending_facebook_logins`) and returns 403.

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
