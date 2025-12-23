# Happy New Year 2026 - Letters Frontend

A premium, emotional letter-writing web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Winter/New Year themed UI with snow effects
- ✉️ Write and receive thoughtful letters
- 🎭 Anonymous letter support
- 📱 Fully responsive design
- ⚡ Built with modern 2025 best practices

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- HTTP Client: Axios
- Auth: JWT stored in localStorage

## Prerequisites

- Node.js 18+
- Backend API running (default: `http://localhost:4000`)

## Installation

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

Notes:
- Uses Clerk Facebook OAuth in the UI
- After sign-in, exchanges Clerk session JWT via `${API_URL}/auth/clerk/exchange`

```text
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

This app uses **Clerk** for **Facebook-only** sign-in.

### Login Flow

1. User clicks "Continue with Facebook" on `/login`
2. Clerk completes Facebook OAuth
3. Frontend exchanges the Clerk session JWT via `${API_URL}/auth/clerk/exchange`
4. If approved, backend returns an app JWT; otherwise backend returns 403 and records a pending login

### Important Notes

- Users don't manually type any IDs
- Username is assigned by an admin during approval

### Pages

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

# Clerk (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

## License

Private - Happy New Year 2026 Project
