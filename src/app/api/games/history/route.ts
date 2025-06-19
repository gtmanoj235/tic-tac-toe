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

    // Get all games where the user is a player
    const userGames = await prisma.game.findMany({
      where: {
        OR: [
          { playerXId: payload.userId },
          { playerOId: payload.userId },
        ],
        status: 'finished',
      },
      include: {
        playerX: {
          select: {
            id: true,
            username: true,
          },
        },
        playerO: {
          select: {
            id: true,
            username: true,
          },
        },
        winner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({
      games: userGames.map(game => ({
        id: game.id,
        playerX: game.playerX,
        playerO: game.playerO,
        winner: game.winner,
        status: game.status,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        isWinner: game.winner?.id === payload.userId,
        isDraw: !game.winner,
      })),
    });
  } catch (error) {
    console.error('Get game history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 