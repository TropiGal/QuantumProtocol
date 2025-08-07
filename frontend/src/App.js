import React, { useState, useEffect, useCallback } from 'react';
import "./App.css";

const GRID_SIZE = 12;
const CELL_SIZE = 40;

// Game elements
const EMPTY = 0;
const WALL = 1;
const CHIP = 2;
const EXIT = 3;
const PLAYER = 4;
const BOT = 5;
const TELEPORTER = 6;
const FORCE_FIELD = 7;
const SMART_BOT = 8;
const LASER = 9;

const GameBoard = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [chipsCollected, setChipsCollected] = useState(0);
  const [totalChips, setTotalChips] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, won, dead
  const [bots, setBots] = useState([]);
  const [smartBots, setSmartBots] = useState([]);
  const [board, setBoard] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(0);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [laserStates, setLaserStates] = useState([]);

  // Enhanced level designs with increasing complexity and portals in every level
  const levels = [
    {
      name: "INITIALIZATION",
      board: [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,0,2,0,6,0,0,0,2,0,1],
        [1,0,1,1,0,1,1,1,0,1,0,1],
        [1,2,0,0,0,0,0,0,0,0,2,1],
        [1,0,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,2,2,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,0,1,0,1],
        [1,2,0,0,0,0,0,0,0,0,2,1],
        [1,0,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,2,0,6,0,0,2,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      bots: [],
      smartBots: [],
      description: "Welcome to Quantum Protocol! Use portals (🌀) to navigate efficiently."
    },
    {
      name: "SECURITY BREACH",
      board: [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,0,0,0,1,1,0,0,0,2,1],
        [1,2,1,6,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,5,0,0,0,0,1],
        [1,0,1,1,1,0,0,0,1,1,1,1],
        [1,0,0,2,0,0,2,0,0,2,0,1],
        [1,1,1,0,0,1,6,0,0,1,0,1],
        [1,0,0,0,1,1,5,1,1,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,1],
        [1,2,0,0,0,2,0,2,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      bots: [{x: 6, y: 3, direction: 1}, {x: 6, y: 7, direction: -1}],
      smartBots: [],
      description: "Security bots patrol the area. Use portals strategically!"
    },
    {
      name: "QUANTUM MAZE",
      board: [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,0,1,2,6,0,1,2,0,0,1],
        [1,0,0,1,0,1,0,1,0,1,0,1],
        [1,2,1,1,0,0,0,1,0,1,2,1],
        [1,0,0,0,0,1,5,0,0,0,0,1],
        [1,1,0,1,0,1,1,1,0,1,0,1],
        [1,6,0,1,0,0,2,0,0,1,0,1],
        [1,0,0,1,1,0,5,0,1,1,0,1],
        [1,0,1,1,0,0,0,0,0,1,1,1],
        [1,2,0,0,0,1,2,1,0,0,2,1],
        [1,0,0,1,0,6,0,0,1,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      bots: [{x: 6, y: 4, direction: 1}, {x: 6, y: 7, direction: -1}],
      smartBots: [],
      description: "Complex maze with multiple portals. Plan your route carefully!"
    },
    {
      name: "NEURAL NETWORK",
      board: [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,0,1,6,0,2,0,0,1,2,1],
        [1,2,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,5,0,0,0,0,0,8,0,1],
        [1,1,0,1,1,0,2,0,1,1,0,1],
        [1,6,0,0,0,1,0,1,0,0,0,1],
        [1,0,1,0,0,0,6,0,0,0,1,1],
        [1,0,0,1,0,5,0,5,0,1,0,1],
        [1,2,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,0,0,0,2,0,0,0,2,1],
        [1,0,0,1,6,0,8,0,1,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      bots: [{x: 3, y: 3, direction: 1}, {x: 5, y: 7, direction: -1}, {x: 7, y: 7, direction: 1}],
      smartBots: [{x: 9, y: 3, direction: 1, targetX: 9, targetY: 3}, {x: 6, y: 10, direction: -1, targetX: 6, targetY: 10}],
      description: "Advanced AI bots (⚡) adapt to your movements! Multiple portals create escape routes."
    },
    {
      name: "QUANTUM ENTANGLEMENT",
      board: [
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,6,1,2,0,5,0,2,1,6,1],
        [1,0,0,1,0,1,0,1,0,1,0,1],
        [1,2,1,0,0,0,8,0,0,0,1,2],
        [1,0,0,0,1,0,0,0,1,0,0,1],
        [1,6,1,0,0,5,2,5,0,0,1,6],
        [1,0,0,0,1,0,0,0,1,0,0,1],
        [1,2,1,0,0,0,8,0,0,0,1,2],
        [1,0,0,1,0,1,0,1,0,1,0,1],
        [1,6,0,1,2,0,5,0,2,1,0,6],
        [1,0,0,0,0,0,8,0,0,0,0,3],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      bots: [{x: 6, y: 1, direction: 1}, {x: 5, y: 5, direction: -1}, {x: 7, y: 5, direction: 1}, {x: 6, y: 9, direction: -1}],
      smartBots: [{x: 6, y: 3, direction: 1, targetX: 6, targetY: 3}, {x: 6, y: 7, direction: -1, targetX: 6, targetY: 7}, {x: 6, y: 10, direction: 1, targetX: 6, targetY: 10}],
      description: "Ultimate challenge! Master the quantum portal network to survive the AI swarm!"
    }
  ];

  const initLevel = useCallback(() => {
    const level = levels[currentLevel];
    setBoard(level.board.map(row => [...row]));
    setBots(level.bots.map(bot => ({...bot})));
    setSmartBots(level.smartBots ? level.smartBots.map(bot => ({...bot})) : []);

    // Find player starting position
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (level.board[y][x] === PLAYER) {
          setPlayerPos({x, y});
          break;
        }
      }
    }

    // Count total chips
    let chips = 0;
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (level.board[y][x] === CHIP) chips++;
      }
    }
    setTotalChips(chips);
    setChipsCollected(0);
    setGameState('playing');
  }, [currentLevel]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Regular bot movement
  useEffect(() => {
    const moveBots = setInterval(() => {
      if (gameState !== 'playing') return;

      setBots(prevBots => prevBots.map(bot => {
        let newX = bot.x + bot.direction;
        let newY = bot.y;

        // Check boundaries and walls
        if (newX < 1 || newX >= GRID_SIZE - 1 || board[newY] && board[newY][newX] === WALL) {
          return {...bot, direction: -bot.direction};
        }

        return {...bot, x: newX};
      }));
    }, 800);

    return () => clearInterval(moveBots);
  }, [gameState, board]);

  // Smart bot movement with player tracking
  useEffect(() => {
    const moveSmartBots = setInterval(() => {
      if (gameState !== 'playing') return;

      setSmartBots(prevBots => prevBots.map(bot => {
        let newX = bot.x;
        let newY = bot.y;

        // Calculate distance to player
        const dx = playerPos.x - bot.x;
        const dy = playerPos.y - bot.y;
        const distance = Math.abs(dx) + Math.abs(dy);

        // If player is within detection range, move towards player
        if (distance <= 4) {
          if (Math.abs(dx) > Math.abs(dy)) {
            newX += dx > 0 ? 1 : -1;
          } else if (dy !== 0) {
            newY += dy > 0 ? 1 : -1;
          }
        } else {
          // Random movement when player not detected
          const moves = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
          const move = moves[Math.floor(Math.random() * moves.length)];
          newX += move.x;
          newY += move.y;
        }

        // Check boundaries and walls
        if (newX < 1 || newX >= GRID_SIZE - 1 || newY < 1 || newY >= GRID_SIZE - 1 || 
            board[newY] && board[newY][newX] === WALL) {
          return bot; // Don't move if blocked
        }

        return {...bot, x: newX, y: newY};
      }));
    }, 1000);

    return () => clearInterval(moveSmartBots);
  }, [gameState, board, playerPos]);

  useEffect(() => {
    // Check for collision with bots
    bots.forEach(bot => {
      if (bot.x === playerPos.x && bot.y === playerPos.y) {
        setGameState('dead');
      }
    });

    // Check for collision with smart bots
    smartBots.forEach(bot => {
      if (bot.x === playerPos.x && bot.y === playerPos.y) {
        setGameState('dead');
      }
    });
  }, [playerPos, bots, smartBots]);

  const handleKeyPress = useCallback((e) => {
    if (gameState !== 'playing') {
      if (e.key === ' ' && gameState === 'won') {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(prev => prev + 1);
          setPlayerLevel(prev => prev + 1);
        }
      } else if (e.key === ' ' && gameState === 'dead') {
        initLevel();
      }
      return;
    }

    let newX = playerPos.x;
    let newY = playerPos.y;

    switch(e.key) {
      case 'ArrowUp': newY--; break;
      case 'ArrowDown': newY++; break;
      case 'ArrowLeft': newX--; break;
      case 'ArrowRight': newX++; break;
      default: return;
    }

    // Check bounds
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return;

    const targetCell = board[newY][newX];

    // Check walls
    if (targetCell === WALL) return;

    // Check exit (only if all chips collected)
    if (targetCell === EXIT && chipsCollected < totalChips) return;

    // Update position
    setPlayerPos({x: newX, y: newY});

    // Collect chip
    if (targetCell === CHIP) {
      setChipsCollected(prev => prev + 1);
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
        newBoard[newY][newX] = EMPTY;
        return newBoard;
      });
    }

    // Handle teleporter
    if (targetCell === TELEPORTER) {
      // Find other teleporter
      const teleporters = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (board[y][x] === TELEPORTER && (x !== newX || y !== newY)) {
            teleporters.push({x, y});
          }
        }
      }
      
      if (teleporters.length > 0) {
        // If multiple teleporters, choose the closest one to exit or a strategic position
        let bestTeleporter = teleporters[0];
        if (teleporters.length > 1) {
          // Find exit position
          let exitX = 0, exitY = 0;
          for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
              if (board[y][x] === EXIT) {
                exitX = x;
                exitY = y;
                break;
              }
            }
          }
          
          // Choose teleporter closest to exit
          let minDistance = Infinity;
          teleporters.forEach(tp => {
            const distance = Math.abs(tp.x - exitX) + Math.abs(tp.y - exitY);
            if (distance < minDistance) {
              minDistance = distance;
              bestTeleporter = tp;
            }
          });
        }
        
        setPlayerPos({x: bestTeleporter.x, y: bestTeleporter.y});
        return;
      }
    }

    // Check win condition
    if (targetCell === EXIT && chipsCollected + (board[newY][newX] === CHIP ? 1 : 0) >= totalChips) {
      setGameState('won');
    }
  }, [gameState, playerPos, board, chipsCollected, totalChips, currentLevel, initLevel]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const getCellStyle = (cellType, x, y) => {
    const baseStyle = {
      width: CELL_SIZE,
      height: CELL_SIZE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontSize: '20px',
      fontWeight: 'bold'
    };

    const glowIntensity = Math.sin(animationFrame * 0.3) * 0.3 + 0.7;

    switch(cellType) {
      case WALL:
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)`,
          border: '1px solid #00ffff',
          boxShadow: `inset 0 0 20px rgba(0, 255, 255, 0.1), 0 0 5px rgba(0, 255, 255, 0.2)`
        };
      case CHIP:
        return {
          ...baseStyle,
          background: 'radial-gradient(circle, #ff1493, #ff69b4)',
          borderRadius: '50%',
          boxShadow: `0 0 ${10 * glowIntensity}px #ff1493, inset 0 0 10px rgba(255, 20, 147, 0.5)`,
          animation: 'pulse 1s infinite'
        };
      case EXIT:
        const exitGlow = chipsCollected >= totalChips ? glowIntensity : 0.3;
        return {
          ...baseStyle,
          background: `radial-gradient(circle, #00ff00 0%, #32cd32 100%)`,
          boxShadow: `0 0 ${20 * exitGlow}px #00ff00`,
          border: '2px solid #00ff00',
          opacity: chipsCollected >= totalChips ? 1 : 0.5
        };
      case TELEPORTER:
        return {
          ...baseStyle,
          background: `conic-gradient(from ${animationFrame * 10}deg, #9400d3, #4b0082, #0000ff, #9400d3)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${15 * glowIntensity}px #9400d3`
        };
      case FORCE_FIELD:
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, transparent 0%, rgba(255, 0, 0, 0.7) 50%, transparent 100%)`,
          boxShadow: '0 0 10px #ff0000'
        };
      default:
        return {
          ...baseStyle,
          background: '#000011',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
            linear-gradient(45deg, rgba(0, 255, 255, 0.02) 0%, transparent 100%)
          `
        };
    }
  };

  const getPlayerStyle = () => {
    const level = playerLevel;
    const glowIntensity = Math.sin(animationFrame * 0.5) * 0.4 + 0.8;
    const size = Math.min(CELL_SIZE * 0.8, 30 + level * 2);

    let playerColor = '#00ffff';
    let secondaryColor = '#ff1493';

    if (level > 3) {
      playerColor = '#ffff00';
      secondaryColor = '#ff6b00';
    } else if (level > 2) {
      playerColor = '#ff6b00';
      secondaryColor = '#ffff00';
    } else if (level > 1) {
      playerColor = '#ff1493';
      secondaryColor = '#00ff00';
    }

    return {
      width: size,
      height: size,
      background: `radial-gradient(circle, ${playerColor} 0%, ${secondaryColor} 70%, ${playerColor} 100%)`,
      borderRadius: level > 0 ? '20%' : '50%',
      boxShadow: `
        0 0 ${20 * glowIntensity}px ${playerColor},
        0 0 ${40 * glowIntensity}px ${playerColor},
        inset 0 0 20px rgba(255, 255, 255, 0.3)
      `,
      border: level > 1 ? `2px solid ${secondaryColor}` : 'none',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) scale(${0.8 + level * 0.1})`,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#000',
      textShadow: `0 0 5px ${playerColor}`
    };
  };

  const getBotStyle = () => {
    const glowIntensity = Math.sin(animationFrame * 0.4) * 0.3 + 0.7;
    return {
      width: CELL_SIZE * 0.7,
      height: CELL_SIZE * 0.7,
      background: 'radial-gradient(circle, #ff0000 0%, #cc0000 100%)',
      borderRadius: '10%',
      boxShadow: `0 0 ${15 * glowIntensity}px #ff0000`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      color: '#fff'
    };
  };

  const getSmartBotStyle = () => {
    const glowIntensity = Math.sin(animationFrame * 0.6) * 0.4 + 0.8;
    return {
      width: CELL_SIZE * 0.8,
      height: CELL_SIZE * 0.8,
      background: 'radial-gradient(circle, #ffff00 0%, #ffa500 100%)',
      borderRadius: '20%',
      boxShadow: `0 0 ${20 * glowIntensity}px #ffff00`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      color: '#000',
      border: '2px solid #ff6600'
    };
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'monospace',
      color: '#00ffff'
    }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
          }
        `}
      </style>

      <div style={{
        marginBottom: '20px',
        textAlign: 'center',
        textShadow: '0 0 10px #00ffff'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          margin: '0 0 10px 0',
          background: 'linear-gradient(45deg, #00ffff, #ff1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none'
        }}>
          QUANTUM PROTOCOL
        </h1>
        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          LEVEL {currentLevel + 1}: {levels[currentLevel].name}
        </div>
        <div style={{ fontSize: '1rem', marginBottom: '10px' }}>
          AI CHIPS: {chipsCollected}/{totalChips} | AVATAR LEVEL: {playerLevel + 1}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#ff69b4', fontStyle: 'italic' }}>
          {levels[currentLevel].description}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '1px',
        border: '2px solid #00ffff',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
        background: '#000011',
        position: 'relative'
      }}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div key={`${x}-${y}`} style={getCellStyle(cell, x, y)}>
              {cell === CHIP && '💎'}
              {cell === EXIT && '🚪'}
              {cell === TELEPORTER && '🌀'}
              {playerPos.x === x && playerPos.y === y && (
                <div style={getPlayerStyle()}>
                  {playerLevel > 2 ? '🔥' : playerLevel > 0 ? '⚡' : '●'}
                </div>
              )}
              {bots.some(bot => bot.x === x && bot.y === y) && (
                <div style={getBotStyle()}>🤖</div>
              )}
              {smartBots.some(bot => bot.x === x && bot.y === y) && (
                <div style={getSmartBotStyle()}>⚡</div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '1rem',
        textShadow: '0 0 5px #00ffff'
      }}>
        {gameState === 'playing' && (
          <div>
            <div>Use arrow keys to move. Collect all AI Quantum Chips!</div>
            <div style={{fontSize: '0.8rem', color: '#888', marginTop: '5px'}}>
              🌀 = Portals | 🤖 = Security Bots | ⚡ = Smart AI Bots
            </div>
          </div>
        )}
        {gameState === 'won' && (
          <div>
            <div style={{ color: '#00ff00', fontSize: '1.5rem', marginBottom: '10px' }}>
              LEVEL COMPLETE! AVATAR UPGRADED!
            </div>
            {currentLevel < levels.length - 1 ? 'Press SPACE for next level' : 'GAME COMPLETE! You are the Quantum Master!'}
          </div>
        )}
        {gameState === 'dead' && (
          <div style={{ color: '#ff0000', fontSize: '1.2rem' }}>
            SECURITY BREACH DETECTED! Press SPACE to restart
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
}

export default App;