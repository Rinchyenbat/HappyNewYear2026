# OAuth Implementation Summary (Outdated)

NOTE: This document describes the previous Instagram OAuth implementation.
The project has been migrated to Facebook login (`/auth/facebook`) and this doc is kept only for historical context.

## What Changed

The frontend has been completely refactored to use **proper Instagram OAuth** instead of manual Instagram ID input.

## Key Changes

### 1. Login Page (`app/login/page.tsx`)
**Before:**
- Text input for Instagram ID
- Manual form submission
- Direct API call with `instagram_id` parameter

**After:**
- "Login with Instagram" button with Instagram gradient
- OAuth flow redirect
- No manual input required
- Handles OAuth callback with token/username in URL params

### 2. Auth Library (`app/lib/auth.ts`)
**Before:**
```typescript
export const login = async (instagramId: string) => {
  const response = await api.get('/auth/instagram/callback', {
    params: { instagram_id: instagramId },
  });
  return response.data;
};
```

**After:**
```typescript
// Removed login function - OAuth handled via redirect
// Only token management functions remain:
// - setAuthToken()
// - logout()
// - getAuthToken()
// - getUsername()
// - isAuthenticated()
```

### 3. Backend Auth Controller (`backend/src/controllers/auth.controller.js`)
**Added:**
- `instagramOAuthInitiate()` - New endpoint to initiate OAuth flow
- Redirect to frontend with token instead of JSON response
- `FRONTEND_URL` environment variable support

**Updated:**
- `instagramOAuthLogin()` now redirects to frontend with `?token=...&username=...`
- Error handling redirects to frontend with `?error=...`

### 4. Backend Auth Routes (`backend/src/routes/auth.routes.js`)
**Added:**
- `GET /auth/instagram` - Initiates Instagram OAuth flow
- Redirects to Instagram's authorization URL

**Existing:**
- `GET /auth/instagram/callback` - Handles OAuth callback
- Now redirects to frontend instead of returning JSON

## Authentication Flow

### Development Mode (DEV_AUTH_BYPASS=true)
```
User clicks button
    ↓
Frontend redirects to: /auth/instagram/callback?instagram_id=rinchyen_b
    ↓
Backend validates against whitelist
    ↓
Backend creates/finds user with assigned username
    ↓
Backend issues JWT
    ↓
Backend redirects to: /login?token=XXX&username=rinchyen
    ↓
Frontend stores token + username in localStorage
    ↓
Frontend redirects to /inbox
```

### Production Mode (DEV_AUTH_BYPASS=false)
```
User clicks button
    ↓
Frontend redirects to: /auth/instagram
    ↓
Backend redirects to: https://api.instagram.com/oauth/authorize?client_id=...
    ↓
User authorizes on Instagram
    ↓
Instagram redirects to: /auth/instagram/callback?code=XXX
    ↓
Backend exchanges code for access token
    ↓
Backend fetches Instagram profile
    ↓
Backend validates against whitelist
    ↓
Backend creates/finds user with assigned username
    ↓
Backend issues JWT
    ↓
Backend redirects to: /login?token=XXX&username=assigned_name
    ↓
Frontend stores token + username in localStorage
    ↓
Frontend redirects to /inbox
```

## Environment Variables

### Backend (.env)
```env
FRONTEND_URL=http://localhost:3000
DEV_AUTH_BYPASS=true
INSTAGRAM_CLIENT_ID=your_app_id
INSTAGRAM_CLIENT_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:4000/auth/instagram/callback
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_INSTAGRAM_APP_ID=  # Optional: Leave empty for dev mode
```

## User Experience

### What Users See
1. **Login Page**: Single "Login with Instagram" button with Instagram gradient colors
2. **OAuth Redirect**: Briefly see Instagram's authorization page (production only)
3. **Automatic Login**: Seamlessly redirected back to app
4. **Welcome**: Land in inbox with assigned username displayed in navbar

### What Users DON'T See
- No Instagram ID input field
- No manual username creation
- No password fields
- No registration forms
- Just one click authentication

## Security Features

✅ **Whitelist Enforcement**: Only pre-approved Instagram accounts can access
✅ **Server-Assigned Usernames**: Users cannot choose usernames
✅ **OAuth Security**: Uses Instagram's official OAuth flow
✅ **JWT Authentication**: Secure token-based auth with 7-day expiry
✅ **No Password Storage**: Password-less authentication
✅ **Read-Only Usernames**: Users cannot change their assigned username

## Testing

### Test the Login Flow
1. Start MongoDB: `mongod --dbpath ~/.mongodb/data`
2. Start backend: `cd backend && DEV_AUTH_BYPASS=true FRONTEND_URL=http://localhost:3000 node src/server.js`
3. Start frontend: `cd frontend && npm run dev`
4. Visit: http://localhost:3000
5. Click "Login with Instagram"
6. Should automatically log in as `rinchyen` user
7. Check localStorage for `token` and `username`

### What to Verify
- [ ] Login button shows Instagram gradient
- [ ] Clicking button redirects (no form submission)
- [ ] Returns to /login page briefly with token in URL
- [ ] Automatically redirects to /inbox
- [ ] Username appears in navbar
- [ ] Can write letters
- [ ] Logout clears token and returns to login

## Production Deployment Checklist

- [ ] Set `DEV_AUTH_BYPASS=false` in backend
- [ ] Configure Instagram App credentials
- [ ] Set `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `INSTAGRAM_REDIRECT_URI`
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Set `NEXT_PUBLIC_INSTAGRAM_APP_ID` in frontend
- [ ] Set `NEXT_PUBLIC_API_URL` to production API
- [ ] Whitelist production callback URL in Instagram App settings
- [ ] Update CORS_ORIGIN in backend to production frontend domain

## Files Modified

### Frontend
- ✏️ `app/login/page.tsx` - Complete rewrite with OAuth button
- ✏️ `app/lib/auth.ts` - Removed login function
- 📄 `README.md` - Updated authentication documentation

### Backend
- ✏️ `src/controllers/auth.controller.js` - Added redirect logic and initiate function
- ✏️ `src/routes/auth.routes.js` - Added /instagram route
- ✏️ `.env.example` - Added FRONTEND_URL and DEV_AUTH_BYPASS

### Documentation
- ✏️ Root `README.md` - Updated authentication flow section
- 📄 `OAUTH_IMPLEMENTATION.md` - This file

## Next Steps

1. ✅ OAuth flow implemented
2. ✅ Development mode working
3. ⏳ Test production OAuth with real Instagram App
4. ⏳ Deploy to staging environment
5. ⏳ User acceptance testing
6. ⏳ Production deployment

---

**Implementation completed on**: December 19, 2025
**Developer**: GitHub Copilot
**Status**: ✅ Ready for testing
