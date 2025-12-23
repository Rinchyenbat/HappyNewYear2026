import { Router } from 'express';

import { asyncHandler } from '../utils/asyncHandler.js';
import { clerkExchangeLogin } from '../controllers/auth.controller.js';

export const authRouter = Router();

// POST /auth/clerk/exchange - Exchange Clerk session token (Authorization: Bearer <clerk_jwt>) for backend JWT
authRouter.post('/clerk/exchange', asyncHandler(clerkExchangeLogin));

