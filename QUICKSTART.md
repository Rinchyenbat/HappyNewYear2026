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

## Step 2: Seed the Database

```bash
cd backend
MONGODB_URI=mongodb://127.0.0.1:27017/hn2026 node src/seed/allowedInstagramUsers.seed.js
```

## Step 3: Start Backend

```bash
cd backend

# Start with environment variables
DEV_AUTH_BYPASS=true \
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

## Step 4: Start Frontend

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

## Step 5: Login & Test

1. Open browser: http://localhost:3000
2. Click **"Login with Instagram"** button
3. If using development bypass, set `NEXT_PUBLIC_DEV_INSTAGRAM_ID` to a whitelisted numeric Instagram ID
4. You'll be redirected to `/inbox`

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

Edit the login redirect in `frontend/app/login/page.tsx`:

```typescript
// Set NEXT_PUBLIC_DEV_INSTAGRAM_ID in frontend/.env.local instead of hardcoding
```

Available test users:
- `61740588898` → username: `Ninjbadgar`
- `6996374317` → username: `Usukhbayar`
- See all whitelisted IDs in `backend/src/seed/allowedInstagramUsers.seed.js`

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
- **Check DEV_AUTH_BYPASS**: Must be `true` for development
- **Check Instagram ID**: Must be in whitelist (see seed script)
- **Check backend logs**: Look for "not_whitelisted" or other errors

## Environment Variables Cheat Sheet

### Backend (Required for Dev)
```bash
DEV_AUTH_BYPASS=true
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
- [ ] Can click "Login with Instagram" without errors
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

For production deployment, see [OAUTH_IMPLEMENTATION.md](OAUTH_IMPLEMENTATION.md) for:
- Real Instagram OAuth setup
- Environment variable configuration
- Deployment checklist

---

**Need help?** Check the full [README.md](README.md) for detailed documentation.
