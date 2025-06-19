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

    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    // Find the game
    const game = await prisma.game.findUnique({
      where: { id: gameId },
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
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (game.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Game is not available to join' },
        { status: 400 }
      );
    }

    if (game.playerXId === payload.userId) {
      return NextResponse.json(
        { error: 'Cannot join your own game' },
        { status: 400 }
      );
    }

    // Join the game as player O
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        playerOId: payload.userId,
        status: 'in_progress',
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
      },
    });

    return NextResponse.json({
      message: 'Joined game successfully',
      game: {
        id: updatedGame.id,
        status: updatedGame.status,
        board: JSON.parse(updatedGame.board),
        playerX: updatedGame.playerX,
        playerO: updatedGame.playerO,
        createdAt: updatedGame.createdAt,
      },
    });
  } catch (error) {
    console.error('Join game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 