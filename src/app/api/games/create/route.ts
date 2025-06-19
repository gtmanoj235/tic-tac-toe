import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a new game with the current user as player X
    const game = await prisma.game.create({
      data: {
        playerXId: payload.userId,
        board: JSON.stringify(Array(9).fill(null)), // Empty board
        status: 'waiting', // Waiting for player O to join
      },
      include: {
        playerX: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Game created successfully',
      game: {
        id: game.id,
        status: game.status,
        board: JSON.parse(game.board),
        playerX: game.playerX,
        createdAt: game.createdAt,
      },
    });
  } catch (error) {
    console.error('Create game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 