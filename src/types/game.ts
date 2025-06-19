export interface AvailableGame {
  id: string;
  playerX: { id: string; username: string };
  playerO?: { id: string; username: string };
  status: string;
  createdAt: string;
}

export interface GameHistoryItem {
  id: string;
  playerX: { id: string; username: string };
  playerO: { id: string; username: string };
  winner?: { id: string; username: string };
  isWinner?: boolean;
  isDraw?: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
} 