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

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map((s) => s.trim()) : false,
    credentials: true
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
