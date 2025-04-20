import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bridge from './Bridge';
import { Character as CharacterType, Direction } from '../types';
import { TranscriptItem } from '../types/transcript';
import useTTS from '../hooks/useTTS';

interface GameplayPhaseProps {
  characters: CharacterType[];
  gameplayTranscript: TranscriptItem[];
  onComplete: () => void;
}

const GameplayPhase = ({ characters, gameplayTranscript, onComplete }: GameplayPhaseProps) => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { speak, isPlaying } = useTTS();
  
  // Track which tiles have been revealed
  const [revealedTiles, setRevealedTiles] = useState<{
    left: boolean[];
    right: boolean[];
  }>({
    left: Array(18).fill(false),
    right: Array(18).fill(false)
  });
  
  // Determine safe tiles based on the transcript data
  const [bridgeTiles, setBridgeTiles] = useState<{
    left: boolean[];
    right: boolean[];
  }>({
    left: Array(18).fill(false),
    right: Array(18).fill(false)
  });
  
  // Current character
  const currentCharacter = characters[currentCharacterIndex];
  
  // Process the transcript to set up the bridge
  useEffect(() => {
    if (gameplayTranscript.length > 0) {
      const leftTiles: boolean[] = Array(18).fill(false);
      const rightTiles: boolean[] = Array(18).fill(false);
      
      let position = 0;
      
      gameplayTranscript.forEach(item => {
        if (
          item.metadata?.chosen_path && 
          (item.metadata.chosen_path === 'left' || item.metadata.chosen_path === 'right') &&
          typeof item.metadata.survived === 'boolean' &&
          position < 18
        ) {
          const direction = item.metadata.chosen_path as Direction;
          const isSafe = item.metadata.survived;
          
          if (direction === 'left') {
            leftTiles[position] = isSafe;
          } else {
            rightTiles[position] = isSafe;
          }
          
          if (isSafe) {
            position++;
          }
        }
      });
      
      setBridgeTiles({ left: leftTiles, right: rightTiles });
    }
  }, [gameplayTranscript]);
  
  // Process current move
  useEffect(() => {
    if (
      gameplayTranscript[currentTranscriptIndex] &&
      !isAnimating && 
      !isPlaying
    ) {
      const currentMove = gameplayTranscript[currentTranscriptIndex];
      
      if (
        currentMove.metadata?.chosen_path && 
        (currentMove.metadata.chosen_path === 'left' || currentMove.metadata.chosen_path === 'right') &&
        typeof currentMove.metadata.survived === 'boolean'
      ) {
        const direction = currentMove.metadata.chosen_path as Direction;
        const isSafe = currentMove.metadata.survived;
        const playerId = currentMove.metadata.player_id;
        
        // Find the character making the move
        if (playerId) {
          const characterIndex = characters.findIndex(char => char.id.toString() === playerId);
          if (characterIndex !== -1) {
            setCurrentCharacterIndex(characterIndex);
          }
        }
        
        // Start animation
        setIsAnimating(true);
        
        // Reveal the tile
        setRevealedTiles(prev => {
          const newRevealedTiles = { ...prev };
          if (direction === 'left') {
            newRevealedTiles.left = [...prev.left];
            newRevealedTiles.left[currentPosition] = true;
          } else {
            newRevealedTiles.right = [...prev.right];
            newRevealedTiles.right[currentPosition] = true;
          }
          return newRevealedTiles;
        });
        
        // Narrate the move
        const narrateText = `${currentCharacter.name} steps ${direction}... and ${isSafe ? 'survives' : 'falls'}.`;
        speak(narrateText);
        
        // Update character status if they fell
        if (!isSafe) {
          characters[currentCharacterIndex].isAlive = false;
        }
        
        // Wait and move to next position/transcript item
        setTimeout(() => {
          if (isSafe) {
            setCurrentPosition(prev => prev + 1);
          }
          
          setCurrentTranscriptIndex(prev => prev + 1);
          setIsAnimating(false);
          
          // Check if game is complete
          if (currentTranscriptIndex >= gameplayTranscript.length - 1) {
            setTimeout(() => {
              onComplete();
            }, 2000);
          }
        }, 3000);
      } else {
        // Skip transcript items that don't represent moves
        setCurrentTranscriptIndex(prev => prev + 1);
      }
    }
  }, [currentTranscriptIndex, isAnimating, isPlaying, gameplayTranscript, currentCharacter, currentPosition, characters, speak, onComplete]);
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-2">Glass Bridge Game</h1>
      <p className="mb-8 text-gray-300">Step carefully to cross the bridge!</p>
      
      {/* Current player */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-xl mb-2">Current Player:</h2>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentCharacter?.id}
            className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-600">
              {currentCharacter?.avatar ? (
                <img
                  src={currentCharacter.avatar}
                  alt={currentCharacter.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                  {currentCharacter?.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold">{currentCharacter?.name}</p>
              <p className={`text-sm ${currentCharacter?.isAlive ? 'text-green-400' : 'text-red-400'}`}>
                {currentCharacter?.isAlive ? 'Active' : 'Eliminated'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Bridge */}
      <Bridge 
        tiles={bridgeTiles}
        revealedTiles={revealedTiles}
        currentPosition={currentPosition}
      />
      
      {/* Game progress */}
      <div className="mt-8 w-full max-w-4xl bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span>Start</span>
          <span>Finish</span>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-blue-500 h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentPosition / 18) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GameplayPhase; 