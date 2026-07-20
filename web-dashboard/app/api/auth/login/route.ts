import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { apiHandler } from '@/lib/api-handler';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const POST = apiHandler(async (request: Request) => {
  await connectToDatabase();
  
  const body = await request.json();
  const { username, password, rememberMe } = loginSchema.parse(body);

  const user = await User.findOne({ username });
  
  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const secretKey = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT({ 
    userId: user._id.toString(), 
    role: user.role,
    username: user.username 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(rememberMe ? '30d' : '1d')
    .sign(secretKey);

  const response = NextResponse.json({ success: true, role: user.role });
  
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge
  });

  return response;
});
