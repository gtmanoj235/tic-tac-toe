import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlLength: process.env.DATABASE_URL?.length || 0,
      },
      database: {
        connected: false,
        error: null as string | null,
      },
    };

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.database.connected = true;
    } catch (dbError) {
      health.database.connected = false;
      health.database.error = dbError instanceof Error ? dbError.message : 'Unknown database error';
      health.status = 'error';
    }

    return NextResponse.json(health, {
      status: health.status === 'ok' ? 200 : 500,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 