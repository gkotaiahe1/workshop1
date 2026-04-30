/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameStatus, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const createInitialState = (): GameState => ({
  snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
  food: { x: 5, y: 5 },
  direction: { x: 0, y: -1 },
  score: 0,
  highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  status: GameStatus.IDLE,
});

export const SnakeGame: React.FC = () => {
  const [game, setGame] = useState<GameState>(createInitialState());
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(p => p.x === newFood!.x && p.y === newFood!.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setGame(prev => {
      if (prev.status !== GameStatus.PLAYING) return prev;

      const newHead = {
        x: (prev.snake[0].x + prev.direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prev.snake[0].y + prev.direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prev.snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        if (prev.score > prev.highScore) {
          localStorage.setItem('snakeHighScore', prev.score.toString());
        }
        return { ...prev, status: GameStatus.GAME_OVER, highScore: Math.max(prev.score, prev.highScore) };
      }

      const newSnake = [newHead, ...prev.snake];
      
      // Check if food eaten
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        return {
          ...prev,
          snake: newSnake,
          food: spawnFood(newSnake),
          score: prev.score + 10,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [spawnFood]);

  useEffect(() => {
    if (game.status === GameStatus.PLAYING) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [game.status, moveSnake, speed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      setGame(prev => {
        const up = { x: 0, y: -1 };
        const down = { x: 0, y: 1 };
        const left = { x: -1, y: 0 };
        const right = { x: 1, y: 0 };

        switch (key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            if (prev.direction.y !== 1) return { ...prev, direction: up };
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            if (prev.direction.y !== -1) return { ...prev, direction: down };
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            if (prev.direction.x !== 1) return { ...prev, direction: left };
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            if (prev.direction.x !== -1) return { ...prev, direction: right };
            break;
        }
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = () => {
    setGame({ ...createInitialState(), status: GameStatus.PLAYING });
    setSpeed(INITIAL_SPEED);
  };

  return (
    <div className="relative group">
      {/* Game Stats Header */}
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Current Score</div>
          <motion.div 
            key={game.score}
            initial={{ scale: 1.2, color: '#00FFFF' }}
            animate={{ scale: 1, color: '#FFFFFF' }}
            className="text-3xl font-black font-mono leading-none"
          >
            {game.score.toString().padStart(4, '0')}
          </motion.div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-white/40 mb-1 justify-end">
            <Trophy size={12} />
            <span className="text-[10px] uppercase tracking-widest">High Score</span>
          </div>
          <div className="text-xl font-bold font-mono text-white/60">
            {game.highScore.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black border-2 border-white/10 rounded-xl shadow-2xl overflow-hidden"
        style={{ 
          width: 'clamp(300px, 80vw, 500px)', 
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-5 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white" />
          ))}
        </div>

        {/* Snake & Food Rendering */}
        <AnimatePresence>
          {/* Food */}
          <motion.div
            key={`food-${game.food.x}-${game.food.y}`}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 90] }}
            className="absolute rounded-sm bg-neon-magenta shadow-[0_0_15px_rgba(255,0,255,0.8)] z-10"
            style={{
              left: `${(game.food.x / GRID_SIZE) * 100}%`,
              top: `${(game.food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
            }}
          />

          {/* Snake Segments */}
          {game.snake.map((segment, i) => (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className="absolute rounded-sm z-20 transition-all duration-150"
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                backgroundColor: i === 0 ? '#00FFFF' : `rgba(0, 255, 255, ${Math.max(0.2, 1 - (i / game.snake.length))})`,
                boxShadow: i === 0 ? '0 0 15px rgba(0, 255, 255, 0.8)' : 'none',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Global Overlays */}
        <AnimatePresence>
          {game.status === GameStatus.IDLE && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 gap-6 text-center"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="text-white/20"
              >
                <div className="text-[120px] font-black opacity-30 select-none">SNAKE</div>
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-neon-cyan glow-cyan">Neon Pulse</h1>
                <p className="text-white/40 text-sm font-mono max-w-[200px]">COLLECT THE MODULES. SURVIVE THE VOID.</p>
              </div>
              <button 
                onClick={startGame}
                className="group relative px-12 py-4 bg-transparent border-2 border-neon-cyan overflow-hidden rounded-full transition-all hover:bg-neon-cyan/10"
              >
                <div className="relative z-10 flex items-center gap-3 text-neon-cyan font-bold uppercase tracking-widest">
                  <Play fill="#00FFFF" size={20} />
                  Initiate Session
                </div>
              </button>
            </motion.div>
          )}

          {game.status === GameStatus.GAME_OVER && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 gap-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-6xl font-black text-rose-500 uppercase italic tracking-tighter">Connection Lost</h2>
                <div className="h-1 w-full bg-rose-500/20 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-8 w-full max-w-[240px]">
                <div className="text-center">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Final Score</div>
                  <div className="text-3xl font-mono font-bold text-white tracking-widest">{game.score}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Best Records</div>
                  <div className="text-3xl font-mono font-bold text-neon-cyan glow-cyan tracking-widest">{game.highScore}</div>
                </div>
              </div>

              <button 
                onClick={startGame}
                className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-transform"
              >
                <RefreshCcw size={20} />
                Reconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Corner Details */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/40" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-neon-cyan/40" />
      <div className="absolute top-2 right-4 text-[8px] font-mono text-white/20 tracking-tighter">GRID_v02 // SYSTEM_ONLINE</div>
    </div>
  );
};
