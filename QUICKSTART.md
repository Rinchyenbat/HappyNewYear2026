# Quick Start Guide - Happy New Year 2026 Letters

Get the application running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed (via Homebrew on macOS)

## Step 1: Start MongoDB

```bash
# Create data directory
mkdir -p ~/.mongodb/data

# Start MongoDB
mongod --dbpath ~/.mongodb/data --logpath ~/.mongodb/mongod.log --fork
```

## Step 2: Start Backend

```bash
cd backend

# Start with environment variables
# Auth is handled via Clerk (Facebook OAuth)
FRONTEND_URL=http://localhost:3000 \
PORT=4000 \
MONGODB_URI=mongodb://127.0.0.1:27017/hn2026 \
JWT_SECRET=dev_secret_key \
node src/server.js
```

**Expected output:**
```
API listening on port 4000
```

## Step 3: Start Frontend

```bash
# In a new terminal
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
✓ Ready in 3.7s
```

## Step 4: Login & Test

1. Open browser: http://localhost:3000
2. Click **"Continue with Facebook"** button
3. Clerk will complete Facebook OAuth
4. If approved, you'll be redirected to `/inbox` (otherwise you'll see a pending approval message)

## Test the Features

### Write a Letter
1. Click "Write Letter" in navbar
2. Select a recipient (e.g., `odko`)
3. Add optional title: "Happy New Year!"
4. Write message in the large textarea
5. Toggle "Send anonymously" if desired
6. Click "Seal & Send"

### View Letters
- **Inbox**: See letters sent to you
- **Sent**: See letters you've written
- Click any letter card to read the full letter with animation

## Stopping the Application

```bash
# Stop MongoDB
pkill mongod

# Stop backend (Ctrl+C in backend terminal)
# Stop frontend (Ctrl+C in frontend terminal)
```

## Login as Different Users

Use a different Facebook account in the Clerk sign-in flow.

Note: with the new approval flow, first-time logins will show "Pending approval" until an admin approves and assigns a username.

## Troubleshooting

### MongoDB won't start
```bash
# Check if already running
pgrep mongod

# Kill existing process
pkill mongod

# Try again with different port
mongod --dbpath ~/.mongodb/data --port 27018
# Update MONGODB_URI accordingly
```

### Backend crashes immediately
- **Check MongoDB**: Make sure MongoDB is running
- **Check port**: Ensure port 4000 is not in use
- **Check .env**: Verify all required env vars are set

### Frontend shows "Failed to fetch"
- **Check backend**: Ensure backend is running on port 4000
- **Check CORS**: Verify CORS_ORIGIN includes http://localhost:3000
- **Check browser console**: Look for specific error messages

### Login redirects but no token
- **Check Clerk env vars**: Frontend needs `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and backend needs `CLERK_JWKS_URL` + `CLERK_ISSUER`
- **Check approval**: First-time logins will be pending until an admin approves and assigns a username
- **Check backend logs**: Look for "pending_approval" or other errors

## Environment Variables Cheat Sheet

### Backend (Required for Dev)
```bash
# No DEV_AUTH_BYPASS (removed). Use Clerk sign-in on /login.
FRONTEND_URL=http://localhost:3000
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/hn2026
JWT_SECRET=dev_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (Auto-configured)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000  # Already in .env.local
```

## Success Checklist

- [ ] MongoDB running and accessible
- [ ] Backend API listening on port 4000
- [ ] Frontend dev server running on port 3000
- [ ] Login button visible on http://localhost:3000
- [ ] Can click "Login with Facebook" without errors
- [ ] Automatically redirected to /inbox after login
- [ ] Username "rinchyen" appears in navbar
- [ ] Can navigate to "Write Letter" page
- [ ] Can see list of recipients in dropdown
- [ ] Can write and send a letter
- [ ] Letter appears in "Sent" page
- [ ] Can view letter details with paper animation

## Next Steps

Once everything works:
1. Write letters to different users
2. Test anonymous sending
3. Try unread letter indicators (gold border)
4. Explore the snow animation effect
5. Test responsive design on mobile

## Production Setup

For production deployment, follow the Clerk auth section in [README.md](README.md).

---

**Need help?** Check the full [README.md](README.md) for detailed documentation.
