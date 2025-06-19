import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get games that are waiting for a second player
    const availableGames = await prisma.game.findMany({
      where: {
        status: 'waiting',
        playerXId: {
          not: payload.userId, // Don't show user's own games
        },
      },
      include: {
        playerX: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      games: availableGames.map(game => ({
        id: game.id,
        playerX: game.playerX,
        createdAt: game.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get available games error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 