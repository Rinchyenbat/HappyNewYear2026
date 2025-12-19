# HappyNewYear2026 Backend

Node.js + Express + MongoDB (Mongoose) backend with:
- Mock Instagram OAuth login
- Instagram ID whitelist
- System-generated usernames
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
This backend only allows login for Instagram IDs present in the `AllowedInstagramID` collection.

Example (Mongo shell):
```js
use hn2026
db.allowedinstagramids.insertOne({ instagramId: "123456789", enabled: true, createdAt: new Date(), updatedAt: new Date() })
```

## Mock login
```bash
curl -s -X POST http://localhost:4000/auth/instagram/login \
  -H 'Content-Type: application/json' \
  -d '{"instagram_id":"123456789"}'
```

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
