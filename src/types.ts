/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  color: string;
}

export type Point = { x: number; y: number };

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Point;
  score: number;
  highScore: number;
  status: GameStatus;
}
