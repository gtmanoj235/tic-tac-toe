'use client';

import { useState } from 'react';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface Game {
  id: string;
  status: string;
  board: (string | null)[];
  playerX?: { id: string; username: string };
  playerO?: { id: string; username: string };
  winner?: string;
  isDraw?: boolean;
  lastMove?: { position: number; player: string };
}

interface GameBoardProps {
  game: Game;
  onMakeMove: (position: number) => void;
  currentUser: User;
}

export default function GameBoard({ game, onMakeMove, currentUser }: GameBoardProps) {
  const [movePending, setMovePending] = useState(false);
  const isPlayerX = game.playerX?.id === currentUser.id;
  
  const isMyTurn = () => {
    if (game.status !== 'in_progress') return false;
    if (!game.lastMove) return isPlayerX; // First move is always X
    const lastMovePlayer = game.lastMove.player === 'X' ? game.playerX?.id : game.playerO?.id;
    return lastMovePlayer !== currentUser.id;
  };

  const handleCellClick = async (position: number) => {
    if (game.board[position] !== null) return; // Cell already taken
    if (!isMyTurn()) return; // Not my turn
    if (game.status !== 'in_progress') return; // Game not in progress
    if (movePending) return; // Already waiting for move to complete

    setMovePending(true);
    try {
      await onMakeMove(position);
    } finally {
      setMovePending(false);
    }
  };

  const getCellContent = (value: string | null, index: number) => {
    if (!value) return '';
    
    const isLastMove = game.lastMove?.position === index;
    const baseClasses = "text-4xl font-bold flex items-center justify-center h-full";
    const colorClasses = value === 'X' ? 'text-blue-600' : 'text-red-600';
    const highlightClasses = isLastMove ? 'bg-blue-50' : '';
    
    return (
      <div className={`${baseClasses} ${colorClasses} ${highlightClasses}`}>
        {value}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-3 gap-2 aspect-square w-72 mx-auto">
        {game.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!isMyTurn() || cell !== null || game.status !== 'in_progress' || movePending}
            className={`
              aspect-square border-2 border-gray-300 rounded-lg
              hover:bg-gray-50 disabled:hover:bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors duration-200
              ${cell !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${isMyTurn() && cell === null && game.status === 'in_progress' && !movePending ? 'hover:border-blue-400' : ''}
            `}
          >
            {getCellContent(cell, index)}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        {game.status === 'waiting' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600">Waiting for another player to join...</p>
          </div>
        )}
        {game.status === 'in_progress' && (
          <div className="flex items-center justify-center space-x-2">
            {!isMyTurn() && !movePending && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
            )}
            <p className="text-gray-600">
              {movePending ? "Making move..." : isMyTurn() ? "Your turn" : "Opponent's turn"}
            </p>
          </div>
        )}
        {game.status === 'finished' && (
          <div className="text-lg font-semibold">
            {game.winner ? (
              <span className={game.winner === 'X' ? 'text-blue-600' : 'text-red-600'}>
                {game.winner === 'X' ? game.playerX?.username : game.playerO?.username} wins!
              </span>
            ) : (
              <span className="text-gray-600">It's a draw!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 