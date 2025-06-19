'use client';

import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import GameStatus from '../components/GameStatus';
import type { AvailableGame, GameHistoryItem } from '../types/game';

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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [availableGames, setAvailableGames] = useState<AvailableGame[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Load initial data
      loadAvailableGames();
      loadGameHistory();
    }
  }, []);

  // Poll for game updates when there's a current game
  useEffect(() => {
    if (!currentGame || !token) return;

    // Don't poll if the game is finished
    if (currentGame.status === 'finished') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/games/${currentGame.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentGame(data.game);
        }
      } catch (error) {
        console.error('Error polling game state:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [currentGame, token]);

  // Poll for available games updates
  useEffect(() => {
    if (!token) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/games/available', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvailableGames(data.games);
        }
      } catch (error) {
        console.error('Error polling available games:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [token]);

  // Poll for game history updates
  useEffect(() => {
    if (!token) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/games/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGameHistory(data.games);
        }
      } catch (error) {
        console.error('Error polling game history:', error);
      }
    }, 10000); // Poll every 10 seconds (less frequent since history doesn't change as often)

    return () => clearInterval(pollInterval);
  }, [token]);

  const handleLogin = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Load initial data after login
    loadAvailableGames();
    loadGameHistory();
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCurrentGame(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleCreateGame = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
        // Immediately refresh available games since we just created one
        loadAvailableGames();
      } else {
        console.error('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    if (!token) return;

    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
        // Immediately refresh available games since we just joined one
        loadAvailableGames();
      } else {
        console.error('Failed to join game');
      }
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  const handleMakeMove = async (position: number) => {
    if (!token || !currentGame) return;

    try {
      const response = await fetch('/api/games/move', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGame.id,
          position,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
        
        // If the game is finished, refresh game history immediately
        if (data.game.status === 'finished') {
          loadGameHistory();
        }
      } else {
        console.error('Failed to make move');
      }
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  const loadAvailableGames = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/games/available', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableGames(data.games);
      }
    } catch (error) {
      console.error('Error loading available games:', error);
    }
  };

  const loadGameHistory = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/games/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGameHistory(data.games);
      }
    } catch (error) {
      console.error('Error loading game history:', error);
    }
  };

  const refreshCurrentGame = async () => {
    if (!currentGame || !token) return;

    try {
      const response = await fetch(`/api/games/${currentGame.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
      }
    } catch (error) {
      console.error('Error refreshing game state:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          {showRegister ? (
            <RegisterForm
              onLogin={handleLogin}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Tic Tac Toe</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Controls */}
          <div className="lg:col-span-1">
            <GameControls
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
              onLoadAvailableGames={loadAvailableGames}
              onLoadGameHistory={loadGameHistory}
              availableGames={availableGames}
              gameHistory={gameHistory}
            />
          </div>

          {/* Game Board */}
          <div className="lg:col-span-2">
            {currentGame ? (
              <div className="space-y-6">
                <GameStatus game={currentGame} currentUser={user} onRefresh={refreshCurrentGame} />
                <GameBoard
                  game={currentGame}
                  onMakeMove={handleMakeMove}
                  currentUser={user}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Welcome to Tic Tac Toe!
                </h2>
                <p className="text-gray-600 mb-6">
                  Create a new game or join an existing one to start playing.
                </p>
                <button
                  onClick={handleCreateGame}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
                >
                  Create New Game
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
