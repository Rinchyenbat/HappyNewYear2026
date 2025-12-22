# Happy New Year 2026 - Letter Writing Application

A premium, emotional letter-writing web application with Facebook OAuth authentication.

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or remote connection string
- Facebook App credentials (or use DEV_AUTH_BYPASS mode)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# For development, you can use DEV_AUTH_BYPASS=true
nano .env

# Start the backend server
npm start
# Server will run on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (already configured)
# Default API URL: http://localhost:4000

# Start the frontend development server
npm run dev
# Frontend will run on http://localhost:3000
```

## 🚀 Deployment (Recommended)

This repository is a monorepo:
- `frontend/` is a Next.js app (deploy to Vercel)
- `backend/` is an Express API (deploy to Render/Railway/Fly/etc.)

### Frontend → Vercel
- Import the repo into Vercel
- Deploy using either:
   - Project **Root Directory**: `frontend`, or
   - Keep root as-is (this repo includes `vercel.json` to point Vercel at `frontend/`)

Set env var on Vercel:
- `NEXT_PUBLIC_API_URL` = your backend public URL (example: `https://hn2026-api.onrender.com`)
- `NEXT_PUBLIC_FACEBOOK_APP_ID` = your Facebook App ID / Client ID (enables real OAuth flow)

### Backend → Render/Railway
Create a Node web service from this repo and set:
- **Root directory**: `backend`
- **Build command**: `npm install`
- **Start command**: `npm start`

Required env vars for backend:
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL` = your frontend public URL (example: `https://your-app.vercel.app`)
- `CORS_ORIGIN` = your Vercel domain(s), comma-separated
   - example: `https://your-app.vercel.app,https://your-custom-domain.com`
- `DEV_AUTH_BYPASS=false` (IMPORTANT: enable real Facebook OAuth in production)

If using real Facebook OAuth in production (not DEV bypass), also set:
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`
- `FACEBOOK_REDIRECT_URI` = `https://<backend-domain>/auth/facebook/callback` (must exactly match your Facebook App settings)

## 🔑 Authentication Flow

### Development Mode (DEV_AUTH_BYPASS=true)
- Click "Login with Facebook" button
- Frontend sends a `facebook_id` to simulate a pre-approved user (development bypass)
- No actual Facebook OAuth required
- Perfect for local development

### Production Mode (DEV_AUTH_BYPASS=false)
- Click "Login with Facebook" button
- Redirects to Facebook OAuth authorization
- Facebook redirects back to backend with code
- If approved, backend issues JWT and redirects to frontend
- If not approved, backend records a pending login and redirects to frontend with a "Pending approval" message

Note: first-time logins will show a "Pending approval" message until an admin approves and assigns a username.

## 📱 Application Flow

1. **Login** (`http://localhost:3000/login`)
   - Click "Login with Facebook" button
   - Facebook OAuth flow (or dev bypass)
   - If approved, backend issues a token
   - If not approved, you'll see "Pending approval" until an admin approves and assigns a username
   - Receives JWT token + username
   - Redirected to inbox

2. **Inbox** (`/inbox`)
   - View all letters sent to you
   - See unread letters (gold border + pulse indicator)
   - Anonymous letters show 🎭 badge
   - Click to read

3. **Write Letter** (`/write`)
   - Select recipient from dropdown
   - Add optional title
   - Write your message (up to 20,000 characters)
   - Toggle anonymous sending
   - Click "Seal & Send"

4. **Sent Letters** (`/sent`)
   - View all letters you've sent
   - Track your correspondence

5. **Read Letter** (`/letter/:id`)
   - Beautiful paper animation
   - Mark as read automatically
   - Anonymous letters hide sender identity

## 🎨 Features

### Backend
- ✅ Express.js + MongoDB + Mongoose
- ✅ JWT Authentication (7-day expiry)
- ✅ Facebook OAuth (Meta Graph API)
- ✅ DEV_AUTH_BYPASS for development
- ✅ Pending approval flow (admin assigns usernames)
- ✅ Anonymous letter support
- ✅ Letter CRUD operations
- ✅ Input validation with express-validator
- ✅ Security: helmet, cors, rate limiting

### Frontend
- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with custom winter theme
- ✅ Framer Motion animations
- ✅ Axios API client with JWT interceptor
- ✅ Responsive design
- ✅ Snow effect animation
- ✅ Paper-opening letter animation
- ✅ Glass-morphism UI effects

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Letter.js
│   │   ├── PendingFacebookLogin.js
│   │   └── ...
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.js
│   │   ├── letters.controller.js
│   │   └── ...
│   ├── routes/          # API endpoints
│   │   ├── auth.routes.js
│   │   ├── letters.routes.js
│   │   └── ...
│   ├── middleware/      # Auth & error handling
│   ├── utils/          # Helper functions
│   ├── seed/           # Database seeders
│   └── config/         # Configuration files

frontend/
├── app/
│   ├── components/     # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── LetterCard.tsx
│   │   ├── LetterPaper.tsx
│   │   ├── AnonymousBadge.tsx
│   │   └── SnowEffect.tsx
│   ├── lib/           # Utilities
│   │   ├── api.ts     # Axios instance
│   │   └── auth.ts    # Auth helpers
│   ├── types/         # TypeScript types
│   ├── login/         # Login page
│   ├── inbox/         # Inbox page
│   ├── sent/          # Sent letters page
│   ├── write/         # Write letter page
│   └── letter/[id]/   # Letter detail page
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/facebook` - Initiate Facebook OAuth
- `GET /auth/facebook/callback` - Facebook OAuth callback (or DEV login)

### Letters
- `POST /letters` - Send a new letter
- `GET /letters/inbox` - Get received letters
- `GET /letters/sent` - Get sent letters
- `GET /letters/:id` - Get letter details
- `PATCH /letters/:id/read` - Mark letter as read

### Users
- `GET /users` - Get all users (for recipient selection)
- `GET /users/profile` - Get current user profile

### Messages (Chat)
- `POST /messages` - Send a message
- `GET /messages/:userId` - Get conversation

### Admin
- `GET /admin/login-logs` - View login logs
- `GET /admin/messages` - View all messages

## 🎨 Design System

### Colors
- **Midnight**: `#0f172a` - Main background
- **Snow**: `#f8fafc` - Text and light elements
- **Pine**: `#065f46` - Accent color
- **Gold**: `#fbbf24` - Primary highlights
- **Winter Blue**: `#3b82f6` - Secondary accent
- **Winter Purple**: `#a855f7` - Anonymous badge

### Typography
- **Serif**: Georgia, Cambria - For headings and letter content
- **Sans**: Inter, system-ui - For UI elements

### Custom Classes
- `.glass-effect` - Frosted glass background
- `.letter-shadow` - Multi-layered shadow for depth
- `.winter-gradient` - Blue to purple gradient

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Test with DEV_AUTH_BYPASS
curl http://localhost:4000/auth/facebook/callback?facebook_id=61740588898

# Test protected endpoint
curl http://localhost:4000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing
1. Visit `http://localhost:3000`
2. Login with Facebook (dev bypass uses a pre-approved facebook_id)
3. Navigate through pages
4. Write and send a letter
5. Check inbox for received letters

## 🚀 Production Deployment

### Backend
1. Set up MongoDB Atlas or production database
2. Configure Facebook OAuth credentials
3. Set `DEV_AUTH_BYPASS=false`
4. Deploy to your hosting service (Heroku, Railway, etc.)
5. Update environment variables

### Frontend
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or your hosting service

## 📝 Environment Variables

### Backend `.env`
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/hn2026
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Frontend + CORS
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Development bypass (skip real Facebook OAuth and accept ?facebook_id=...)
DEV_AUTH_BYPASS=true

# Optional for production
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:4000/auth/facebook/callback
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional (development only): choose which Facebook user id you simulate in DEV_AUTH_BYPASS mode
# NEXT_PUBLIC_DEV_FACEBOOK_ID=
```

## 🎭 Anonymous Letter System

When sending an anonymous letter:
- The recipient sees sender as "Anonymous" with 🎭 badge
- Your identity is completely hidden from the recipient
- The system still stores sender information for moderation
- You can still see your anonymous letters in "Sent" page

## 🛡️ Security Features

- JWT-based authentication with 7-day expiry
- Password-less authentication via Facebook
- Admin approval required for first-time logins
- Rate limiting on all routes
- CORS configured for frontend domain
- Helmet for security headers
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

## 📦 Dependencies

### Backend
- express 4.19.2
- mongoose 8.8.3
- jsonwebtoken 9.0.2
- express-validator 7.2.0
- helmet 8.0.0
- cors 2.8.5
- dotenv 16.4.7

### Frontend
- next 14.2.0
- react 18.3.0
- typescript 5.4.0
- tailwindcss 3.4.0
- framer-motion 11.0.0
- axios 1.7.0

## 📄 License

Private Project - Happy New Year 2026

---

Built with ❤️ for a meaningful New Year celebration
