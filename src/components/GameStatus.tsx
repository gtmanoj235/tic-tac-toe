'use client';

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

interface GameStatusProps {
  game: Game;
  currentUser: User;
  onRefresh?: () => void;
}

export default function GameStatus({ game, currentUser, onRefresh }: GameStatusProps) {
  const isPlayerX = game.playerX?.id === currentUser.id;
  const isPlayerO = game.playerO?.id === currentUser.id;
  const isMyTurn = () => {
    if (game.status !== 'in_progress') return false;
    if (!game.lastMove) return isPlayerX; // First move is always X
    const lastMovePlayer = game.lastMove.player === 'X' ? game.playerX?.id : game.playerO?.id;
    return lastMovePlayer !== currentUser.id;
  };

  const getStatusText = () => {
    switch (game.status) {
      case 'waiting':
        return 'Waiting for opponent to join...';
      case 'in_progress':
        return isMyTurn() ? "Your turn" : "Opponent's turn";
      case 'finished':
        if (game.winner) {
          const winnerName = game.winner === 'X' ? game.playerX?.username : game.playerO?.username;
          return `${winnerName} wins!`;
        }
        return "It's a draw!";
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (game.status) {
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return isMyTurn() ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100';
      case 'finished':
        if (game.winner) {
          const isWinner = (game.winner === 'X' && isPlayerX) || (game.winner === 'O' && isPlayerO);
          return isWinner ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
        }
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Game Status</h2>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Refresh
            </button>
          )}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player X */}
        <div className={`p-4 rounded-lg border-2 ${
          isPlayerX ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-600">Player X</p>
              <p className="text-gray-700">{game.playerX?.username || 'Waiting...'}</p>
            </div>
            {isPlayerX && (
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">You</span>
            )}
          </div>
        </div>

        {/* Player O */}
        <div className={`p-4 rounded-lg border-2 ${
          isPlayerO ? 'border-red-500 bg-red-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-600">Player O</p>
              <p className="text-gray-700">{game.playerO?.username || 'Waiting...'}</p>
            </div>
            {isPlayerO && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">You</span>
            )}
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Game ID: {game.id.slice(0, 8)}...</span>
          {game.lastMove && (
            <span>
              Last move: {game.lastMove.player} at position {game.lastMove.position + 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 