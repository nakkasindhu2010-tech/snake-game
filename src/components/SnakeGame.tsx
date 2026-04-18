import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
      case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
      case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
      case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      case ' ': setIsPaused(prev => !prev); break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE; break;
        case 'DOWN': newHead.y = (newHead.y + 1) % GRID_SIZE; break;
        case 'LEFT': newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE; break;
        case 'RIGHT': newHead.x = (newHead.x + 1) % GRID_SIZE; break;
      }

      // Check collision with self
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snake-high-score', score.toString());
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateRef.current;

      if (deltaTime > GAME_SPEED) {
        moveSnake();
        lastUpdateRef.current = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((p, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      if (isHead) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
      }
      
      const padding = 2;
      ctx.fillRect(
        p.x * cellSize + padding,
        p.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] items-end px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono font-bold">Current Score</span>
          <div className="text-5xl font-black neon-text-cyan font-mono leading-none">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-white/40 mb-1">
            <Trophy size={14} className="text-neon-yellow" fill="currentColor" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold">High Score</span>
          </div>
          <div className="text-2xl font-bold text-white/60 font-mono leading-none">{highScore.toString().padStart(4, '0')}</div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass p-1 rounded-lg overflow-hidden flex items-center justify-center">
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="rounded cursor-none"
            />
            
            <AnimatePresence>
                {(isPaused || isGameOver) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                    >
                        {isGameOver ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-8"
                            >
                                <h2 className="text-6xl font-black neon-text-pink mb-4 uppercase tracking-tighter italic">Game Over</h2>
                                <p className="text-white/60 font-mono text-lg">You crashed into the grid!</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mb-8"
                            >
                                <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">Ready to Slither?</h2>
                                <p className="text-white/60 font-mono text-sm tracking-wide">Use Arrow Keys to move • Space to Pause</p>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                            className={`flex items-center gap-3 px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all duration-300 ${isGameOver ? 'bg-neon-pink text-black' : 'bg-neon-cyan text-black'}`}
                        >
                            {isGameOver ? (
                                <><RotateCcw size={20} /> Play Again</>
                            ) : (
                                <><Play size={20} /> Start Game</>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
      
      <div className="text-white/30 text-[10px] uppercase font-mono tracking-[0.2em] flex gap-4">
        <span>[Arrow Keys] Navigate</span>
        <span>[Space] Pause</span>
      </div>
    </div>
  );
}
