'use client';

import { useState, useEffect } from 'react';

interface GameControlsProps {
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
  onLoadAvailableGames: () => void;
  onLoadGameHistory: () => void;
  availableGames: any[];
  gameHistory: any[];
}

export default function GameControls({
  onCreateGame,
  onJoinGame,
  onLoadAvailableGames,
  onLoadGameHistory,
  availableGames,
  gameHistory,
}: GameControlsProps) {
  const [lastAvailableGamesUpdate, setLastAvailableGamesUpdate] = useState<Date>(new Date());
  const [lastHistoryUpdate, setLastHistoryUpdate] = useState<Date>(new Date());

  // Update timestamps when data changes
  useEffect(() => {
    setLastAvailableGamesUpdate(new Date());
  }, [availableGames]);

  useEffect(() => {
    setLastHistoryUpdate(new Date());
  }, [gameHistory]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Create Game */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Game</h3>
        <button
          onClick={onCreateGame}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Create Game
        </button>
      </div>

      {/* Available Games */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Available Games</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(lastAvailableGamesUpdate)}
            </span>
            <button
              onClick={onLoadAvailableGames}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        {availableGames.length === 0 ? (
          <p className="text-gray-500 text-sm">No games available to join</p>
        ) : (
          <div className="space-y-2">
            {availableGames.map((game) => (
              <div
                key={game.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md"
              >
                <div>
                  <p className="font-medium">{game.playerX.username}</p>
                  <p className="text-sm text-gray-500">
                    Created {new Date(game.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onJoinGame(game.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Game History</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(lastHistoryUpdate)}
            </span>
            <button
              onClick={onLoadGameHistory}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        {gameHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No games played yet</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {gameHistory.map((game) => (
              <div
                key={game.id}
                className="p-3 border border-gray-200 rounded-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">{game.playerX.username}</span>
                      {' vs '}
                      <span className="font-medium">{game.playerO.username}</span>
                    </p>
                    <p className="text-gray-500">
                      {new Date(game.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {game.isWinner ? (
                      <span className="text-green-600 font-semibold text-sm">Won</span>
                    ) : game.isDraw ? (
                      <span className="text-gray-600 font-semibold text-sm">Draw</span>
                    ) : (
                      <span className="text-red-600 font-semibold text-sm">Lost</span>
                    )}
                  </div>
                </div>
                {game.winner && (
                  <p className="text-xs text-gray-500">
                    Winner: {game.winner.username}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 