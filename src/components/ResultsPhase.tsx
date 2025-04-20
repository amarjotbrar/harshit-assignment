import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Character as CharacterType } from '../types';
import useTTS from '../hooks/useTTS';

interface ResultsPhaseProps {
  characters: CharacterType[];
  onRestart: () => void;
}

const ResultsPhase = ({ characters, onRestart }: ResultsPhaseProps) => {
  const { speak } = useTTS();
  
  const survivors = characters.filter(char => char.isAlive);
  const fallen = characters.filter(char => !char.isAlive);
  
  useEffect(() => {
    const resultText = survivors.length > 0
      ? `Game over! ${survivors.length} players survived the glass bridge.`
      : 'Game over! No players survived the glass bridge.';
      
    speak(resultText);
  }, [speak, survivors.length]);
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-4">Game Results</h1>
      
      {survivors.length > 0 ? (
        <>
          <p className="text-xl mb-8 text-green-400">
            {survivors.length} player{survivors.length !== 1 ? 's' : ''} survived!
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Survivors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {survivors.map(character => (
              <motion.div
                key={character.id}
                className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 overflow-hidden">
                  {character.avatar ? (
                    <img 
                      src={character.avatar} 
                      alt={character.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                      {character.name.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="font-bold">{character.name}</p>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xl mb-8 text-red-400">No players survived!</p>
      )}
      
      {fallen.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Fallen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {fallen.map(character => (
              <motion.div
                key={character.id}
                className="bg-gray-800 p-4 rounded-lg flex flex-col items-center opacity-60"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 overflow-hidden">
                  {character.avatar ? (
                    <img 
                      src={character.avatar} 
                      alt={character.name} 
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                      {character.name.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="font-bold">{character.name}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
      
      <motion.button
        className="mt-8 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Play Again
      </motion.button>
    </motion.div>
  );
};

export default ResultsPhase; 