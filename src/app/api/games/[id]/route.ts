import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const gameId = params.id;

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
        moves: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if user is a player in this game
    if (game.playerXId !== payload.userId && game.playerOId !== payload.userId) {
      return NextResponse.json(
        { error: 'You are not a player in this game' },
        { status: 403 }
      );
    }

    const board = JSON.parse(game.board) as (string | null)[];
    const lastMove = game.moves[0];

    return NextResponse.json({
      game: {
        id: game.id,
        status: game.status,
        board,
        playerX: game.playerX,
        playerO: game.playerO,
        winner: game.winnerId ? (game.winnerId === game.playerXId ? 'X' : 'O') : null,
        isDraw: game.status === 'finished' && !game.winnerId,
        lastMove: lastMove ? {
          position: lastMove.position,
          player: lastMove.playerId === game.playerXId ? 'X' : 'O',
        } : undefined,
      },
    });
  } catch (error) {
    console.error('Get game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 