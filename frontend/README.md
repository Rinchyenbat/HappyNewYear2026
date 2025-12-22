# Happy New Year 2026 - Letters Frontend

A premium, emotional letter-writing web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Winter/New Year themed UI with snow effects
- ✉️ Write and receive thoughtful letters
- 🎭 Anonymous letter support
- 📱 Fully responsive design
- ⚡ Built with modern 2025 best practices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Authentication**: JWT (localStorage)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:4000`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── LetterCard.tsx
│   ├── LetterPaper.tsx
│   ├── AnonymousBadge.tsx
│   └── SnowEffect.tsx
├── lib/                # Utilities and API clients
│   ├── api.ts
│   └── auth.ts
├── types/              # TypeScript type definitions
│   └── letter.ts
├── login/             # Login page
├── inbox/             # Inbox page
├── sent/              # Sent letters page
├── write/             # Write letter page
└── letter/[id]/       # Letter detail page
```

## Authentication

This app uses **Instagram OAuth** for authentication (not manual Instagram ID input).

### Login Flow

1. User clicks "Login with Instagram" button
2. **Development Mode** (`NEXT_PUBLIC_INSTAGRAM_APP_ID` not set):
   - Redirects to `${API_URL}/auth/instagram/callback?instagram_id=...`
   - Uses `NEXT_PUBLIC_DEV_INSTAGRAM_ID` to simulate one whitelisted user
   - Backend uses DEV_AUTH_BYPASS to authenticate the selected test user
   - Backend redirects to `/login?token=...&username=...`
   
3. **Production Mode** (`NEXT_PUBLIC_INSTAGRAM_APP_ID` set):
   - Redirects to `${API_URL}/auth/instagram`
   - Backend redirects to Instagram OAuth
   - Instagram redirects to `${API_URL}/auth/instagram/callback?code=...`
   - Backend validates code, checks whitelist, assigns username
   - Backend redirects to `/login?token=...&username=...`

4. Frontend receives token & username in URL params
5. Stores in localStorage
6. Redirects to `/inbox`

### Important Notes

- Users **never** manually type Instagram ID or username
- Username is **system-assigned** from whitelist (read-only)
- Frontend displays assigned username from `localStorage.getItem('username')`
- Only whitelisted Instagram accounts can access the app

## Features

### Pages

1. **Login** - Instagram OAuth button (no manual input)
2. **Inbox** - View received letters
3. **Sent** - View sent letters
4. **Write Letter** - Compose new letters
5. **Read Letter** - View letter details with animation

### Components

- **LetterCard** - Letter preview with envelope-like design
- **LetterPaper** - Full letter view with paper animation
- **AnonymousBadge** - Visual indicator for anonymous letters
- **Navbar** - Navigation with active state
- **SnowEffect** - Ambient winter snow animation

## API Integration

The frontend connects to the backend API:

- `GET /letters/inbox` - Fetch received letters
- `GET /letters/sent` - Fetch sent letters
- `POST /letters` - Send a new letter
- `GET /letters/:id` - Get letter details
- `PATCH /letters/:id/read` - Mark letter as read

## Design System

### Colors

- **Midnight**: `#0f172a` - Dark backgrounds
- **Snow**: `#f8fafc` - Light text/backgrounds
- **Pine**: `#065f46` - Accent color
- **Gold**: `#fbbf24` - Primary accent

### Typography

- **Headings**: Georgia, serif
- **Body**: Inter, sans-serif

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional (development only): pick which whitelisted user you simulate in DEV_AUTH_BYPASS mode
# NEXT_PUBLIC_DEV_INSTAGRAM_ID=6996374317
```

## License

Private - Happy New Year 2026 Project
