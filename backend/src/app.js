import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import { authRouter } from './routes/auth.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { messagesRouter } from './routes/messages.routes.js';
import { lettersRouter } from './routes/letters.routes.js';
import { adminRouter } from './routes/admin.routes.js';

export const app = express();

app.disable('x-powered-by');

// When deployed behind a reverse proxy (Render/Railway/etc.), trust the first proxy hop
// so req.ip and rate limiting behave correctly.
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

if (allowedOrigins.length === 0 && env.FRONTEND_URL) {
  allowedOrigins.push(env.FRONTEND_URL.trim());
}

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : env.NODE_ENV === 'production' ? false : true,
    credentials: false
  })
);

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })
);

app.use(express.json({ limit: '32kb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/letters', lettersRouter);
app.use('/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);
