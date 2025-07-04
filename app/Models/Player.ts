export interface Player {
  id: number;
  name: string;
  colorBall: number;
  redRemaining: number;
  password?: string;
  isWinner: boolean;
  coloredPottedBalls: number[];
  redPottedBalls: number;
  pitok: number;
  isPlayerTurn: boolean;
}