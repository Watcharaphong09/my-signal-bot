import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export function apiHandler(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    try {
      // Call the route handler
      return await handler(request, ...args);
    } catch (error: any) {
      console.error('API Error:', error);

      // Validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: (error as any).errors },
          { status: 400 }
        );
      }

      // MongoDB/Mongoose errors
      if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json(
          { error: 'Database Validation Error', details: error.message },
          { status: 400 }
        );
      }

      // JWT Authentication errors are handled by middleware usually, 
      // but if we throw them manually in API:
      if (error.name === 'JWTExpired' || error.name === 'JWTInvalid') {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Token is invalid or expired' },
          { status: 401 }
        );
      }

      // Default Server Error
      return NextResponse.json(
        { error: 'Internal Server Error', message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong' },
        { status: 500 }
      );
    }
  };
}
