import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();

// Win condition patterns
const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

function checkWinner(board: (string | null)[]): string | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board: (string | null)[]): boolean {
  return board.every(cell => cell !== null);
}

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { gameId, position } = await request.json();

    if (!gameId || position === undefined) {
      return NextResponse.json(
        { error: 'Game ID and position are required' },
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

    if (game.status !== 'in_progress') {
      return NextResponse.json(
        { error: 'Game is not in progress' },
        { status: 400 }
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

    // Check if position is valid
    if (position < 0 || position > 8 || board[position] !== null) {
      return NextResponse.json(
        { error: 'Invalid move' },
        { status: 400 }
      );
    }

    // Determine current player
    const isPlayerX = game.playerXId === payload.userId;
    const currentPlayer = isPlayerX ? 'X' : 'O';

    // Check if it's the player's turn
    const lastMove = game.moves[0];
    if (lastMove) {
      const lastMovePlayer = lastMove.playerId === game.playerXId ? 'X' : 'O';
      if (lastMovePlayer === currentPlayer) {
        return NextResponse.json(
          { error: 'Not your turn' },
          { status: 400 }
        );
      }
    } else {
      // First move should be by player X
      if (!isPlayerX) {
        return NextResponse.json(
          { error: 'Not your turn' },
          { status: 400 }
        );
      }
    }

    // Make the move
    board[position] = currentPlayer;

    // Check for winner
    const winner = checkWinner(board);
    const isDraw = !winner && isBoardFull(board);
    const newStatus = winner ? 'finished' : isDraw ? 'finished' : 'in_progress';

    // Update game and create move
    const [updatedGame] = await prisma.$transaction([
      prisma.game.update({
        where: { id: gameId },
        data: {
          board: JSON.stringify(board),
          status: newStatus,
          winnerId: winner ? (isPlayerX ? game.playerXId : game.playerOId) : null,
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
      }),
      prisma.move.create({
        data: {
          gameId,
          playerId: payload.userId,
          position,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Move made successfully',
      game: {
        id: updatedGame.id,
        status: updatedGame.status,
        board,
        playerX: updatedGame.playerX,
        playerO: updatedGame.playerO,
        winner: winner,
        isDraw,
        lastMove: {
          position,
          player: currentPlayer,
        },
      },
    });
  } catch (error) {
    console.error('Make move error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 