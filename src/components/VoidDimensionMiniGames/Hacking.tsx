import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, ReactNode } from "react";
import {
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Timer,
} from "lucide-react";

type HackingProps = {
  onReturn: () => void;
  onHackSuccess?: (score) => void;
};

type HackingMode = "sequence" | "memory";
type Difficulty = "easy" | "medium" | "hard" | "expert";

interface HackingState {
  mode: HackingMode;
  difficulty: Difficulty;
  timeLimit: number;
  timeLeft: number;
  lives: number;
  score: number;
  level: number;
}

const renderHeart = (amount: number): ReactNode => {
  const listItems = [];
  for (let i = 0; i < amount; i++) {
    listItems.push(<Heart className="text-red-400 w-4" />);
  }

  return listItems;
};

function Hacking({ onReturn, onHackSuccess }: HackingProps) {
  const [gameState, setGameState] = useState<HackingState>({
    mode: "sequence",
    difficulty: "easy",
    timeLimit: 60,
    timeLeft: 60,
    lives: 3,
    score: 0,
    level: 1,
  });

  // Sequence Mode State
  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  // Memory Mode State
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Timer
  useEffect(() => {
    if (isGameActive && gameState.timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft <= 0 && isGameActive) {
      handleGameOver();
    }
  }, [gameState.timeLeft, isGameActive, gameCompleted]);

  const handleGameOver = () => {
    setGameState((prev) => ({ ...prev, lives: prev.lives - 1 }));
    if (gameState.lives <= 1) {
      setIsGameActive(false);
      alert("SYSTEM BREACH FAILED - All attempts exhausted!");
    } else {
      startChallenge();
    }
  };

  const initializeSequenceMode = () => {
    const size = Math.min(4 + gameState.level, 12);
    const numbers = Array.from({ length: size }, (_, i) => i + 1);

    const shuffled = [...numbers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setPuzzle(shuffled);
    setSelectedIndex(null);
    setMoves(0);
  };

  const initializeMemoryMode = () => {
    const length = Math.min(3 + gameState.level, 10);
    const seq = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setUserSequence([]);
    setShowingSequence(true);
    setSequenceIndex(0);

    // Show sequence
    const showNext = (index: number) => {
      if (index < seq.length) {
        setTimeout(() => {
          setSequenceIndex(index);
          showNext(index + 1);
        }, 800);
      } else {
        setTimeout(() => {
          setShowingSequence(false);
        }, 1000);
      }
    };
    showNext(0);
  };

  const startChallenge = () => {
    setGameCompleted(false);
    setCurrentChallenge((prev) => prev + 1);

    const modes: HackingMode[] = ["sequence", "memory"];
    const newMode = modes[Math.floor(Math.random() * modes.length)];

    setGameState((prev) => ({
      ...prev,
      mode: newMode,
      timeLeft: Math.max(30, prev.timeLimit - prev.level * 5),
    }));

    switch (newMode) {
      case "sequence":
        initializeSequenceMode();
        break;
      case "memory":
        initializeMemoryMode();
        break;
    }
  };

  const handleChallengeComplete = () => {
    const bonus = Math.floor(gameState.timeLeft * 10);
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 100 + bonus,
      level: prev.level + 1,
    }));

    setGameCompleted(true);

    if (currentChallenge >= 5) {
      setTimeout(() => {
        onHackSuccess?.(gameState.score);
      }, 2000);
    } else {
      setTimeout(startChallenge, 2000);
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    setCurrentChallenge(0);
    setGameState({
      mode: "sequence",
      difficulty: "easy",
      timeLimit: 60,
      timeLeft: 60,
      lives: 3,
      score: 0,
      level: 1,
    });
    startChallenge();
  };

  // Sequence Mode Handlers
  const handleSequenceTileClick = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newPuzzle = [...puzzle];
      [newPuzzle[selectedIndex], newPuzzle[index]] = [
        newPuzzle[index],
        newPuzzle[selectedIndex],
      ];

      setPuzzle(newPuzzle);
      setSelectedIndex(null);
      setMoves(moves + 1);

      if (checkSequenceSolution(newPuzzle)) {
        handleChallengeComplete();
      }
    }
  };

  const checkSequenceSolution = (arr: number[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  };

  // Memory Mode Handlers
  const handleMemoryClick = (value: number) => {
    if (showingSequence) return;

    const newUserSequence = [...userSequence, value];
    setUserSequence(newUserSequence);

    if (
      newUserSequence[newUserSequence.length - 1] !==
      sequence[newUserSequence.length - 1]
    ) {
      handleGameOver();
      return;
    }

    if (newUserSequence.length === sequence.length) {
      handleChallengeComplete();
    }
  };

  const renderChallenge = () => {
    switch (gameState.mode) {
      case "sequence":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-cyan-400">
                  SEQUENCE RESTORATION
                </h2>
              </div>
              <p className="text-sm text-gray-400">
                Arrange numbers in ascending order
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {puzzle.map((num, index) => (
                <motion.button
                  key={index}
                  className={`aspect-square text-xl font-bold rounded-xl border-2 transition-all relative overflow-hidden ${
                    selectedIndex === index
                      ? "border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/20"
                      : "border-gray-600 bg-gray-800/50 hover:border-cyan-400/50 hover:bg-gray-700/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSequenceTileClick(index)}
                >
                  {selectedIndex === index && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 animate-pulse" />
                  )}
                  <span className="relative z-10">{num}</span>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-600">
                <span className="text-sm text-gray-400">Moves:</span>
                <span className="text-sm font-bold text-cyan-400">{moves}</span>
              </div>
            </div>
          </div>
        );

      case "memory":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-400">
                  MEMORY SEQUENCE
                </h2>
              </div>
              <p className="text-sm text-gray-400">
                {showingSequence
                  ? "Memorize the sequence..."
                  : "Repeat the sequence"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {[0, 1, 2, 3].map((value) => (
                <motion.button
                  key={value}
                  className={`aspect-square rounded-xl font-bold text-xl border-2 transition-all relative overflow-hidden ${
                    showingSequence &&
                    sequenceIndex < sequence.length &&
                    sequence[sequenceIndex] === value
                      ? "border-blue-400 bg-blue-400/20 shadow-lg shadow-blue-400/20"
                      : "border-gray-600 bg-gray-800/50 hover:border-blue-400/50 hover:bg-gray-700/50"
                  }`}
                  whileHover={!showingSequence ? { scale: 1.05 } : {}}
                  whileTap={!showingSequence ? { scale: 0.95 } : {}}
                  onClick={() => handleMemoryClick(value)}
                  disabled={showingSequence}
                >
                  {showingSequence &&
                    sequenceIndex < sequence.length &&
                    sequence[sequenceIndex] === value && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-pulse" />
                    )}
                  <span className="relative z-10">{value + 1}</span>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-600">
                <span className="text-sm text-gray-400">Progress:</span>
                <span className="text-sm font-bold text-blue-400">
                  {userSequence.length} / {sequence.length}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isGameActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="glass-panel bg-gray-900/95 border-2 border-cyan-500/50 p-8 rounded-xl text-center text-cyan-400 max-w-md w-full">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            animate={{
              textShadow: [
                "0 0 10px #00ffff",
                "0 0 20px #00ffff",
                "0 0 10px #00ffff",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <AlertTriangle className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold">HACKING PROTOCOL</h1>
          </motion.div>

          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-300">Multi-Stage Security Breach</p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>Sequence Restoration</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <Brain className="w-5 h-5 text-blue-400" />
                <span>Memory Sequences</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              onClick={startGame}
              className="w-full px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold border border-cyan-500/50 transition-all"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(0,255,255,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              INITIATE BREACH
            </motion.button>

            <button
              onClick={onReturn}
              className="w-full px-8 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl font-bold border border-gray-600 transition-all"
            >
              ABORT
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-4 h-[660px]"
    >
      <div className="glass-panel bg-gray-900/95 border-2 border-cyan-500/50 p-6 rounded-xl text-cyan-400 max-w-4xl w-full h-[660px]">
        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <AlertTriangle className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold">BREACH PROTOCOL</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <HackingLabel title={"Level:"} number={gameState.level} />

            <HackingLabel
              title="Score"
              number={gameState.score}
              textNumberClass="text-green-400"
            />

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-600">
              {renderHeart(gameState.lives)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border w-[100px] ${
                gameState.timeLeft <= 10
                  ? "bg-red-900/20 border-red-500/50 text-red-400"
                  : "bg-cyan-900/20 border-cyan-500/50 text-cyan-400"
              }`}
            >
              <span className="text-base font-bold flex gap-4">
                <Timer className="w-4" /> {gameState.timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-600 text-sm">
              <span>Stage {currentChallenge}/5</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-800/50 rounded-full h-3 border border-gray-600 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentChallenge / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Challenge Area */}
        <div className="min-h-96 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {gameCompleted ? (
              <motion.div
                key="completed"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-green-500/20 border border-green-500/30">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                </div>
                <div className="text-xl font-bold text-green-400">
                  CHALLENGE COMPLETED
                </div>
                <div className="text-sm text-gray-400">
                  {currentChallenge >= 5
                    ? "SYSTEM BREACHED!"
                    : "Preparing next challenge..."}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={gameState.mode}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="w-full"
              >
                {renderChallenge()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onReturn}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-800/30 border border-red-500/50 rounded-lg text-sm text-red-400 transition-all"
          >
            <XCircle className="w-4 h-4" />
            EMERGENCY ABORT
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Hacking;

type HackingLabelProps = {
  title: string;
  number: number;
  textNumberClass?: string;
  icon?: ReactNode;
};

function HackingLabel({
  title,
  number,
  textNumberClass,
  icon,
}: HackingLabelProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-600">
      {icon}
      <span>{title}</span>
      <span className={`font-bold text-cyan-400 ${textNumberClass}`}>
        {number}
      </span>
    </div>
  );
}
