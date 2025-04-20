//modules
import Image from 'next/image';
import { motion } from 'framer-motion';
//hooks 
import useTTS from '@/hooks/useTTS';
import { useState, useEffect } from 'react';
//types
import { Character as CharacterType } from '@/types/character';

interface IntroductionPhaseProps {
  characters: CharacterType[];
  onComplete: () => void;
}

const IntroductionPhase = ({ characters, onComplete }: IntroductionPhaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { speak, isPlaying } = useTTS();
  
  const currentCharacter = characters[currentIndex];
  
  useEffect(() => {
    if (currentCharacter) {
      const introText = `${currentCharacter.name} says: ${currentCharacter.introduction}`;
      speak(introText);
    }
  }, [currentIndex, currentCharacter, speak]);
  
  const handleNextCharacter = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      onComplete();
    }
  };
  
  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gray-900 text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-10 text-center">Character Introductions</h1>

      <div className="flex justify-between items-start gap-8">
        {/* Left side characters */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            {characters.slice(0, Math.floor(characters.length/2)).map((char, index) => (
              <div 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                  ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <div className="w-20 h-20 rounded-full bg-gray-600 mb-2">
                  {char.avatar && <Image src={char.avatar} alt={char.name} width={80} height={80} className="w-full h-full rounded-full object-cover" />}
                </div>
                <span className="text-sm font-medium">{char.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center current character */}
        <div className="flex-[2] flex flex-col items-center">
          {currentCharacter && (
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-gray-600 mb-4">
                {currentCharacter.avatar && (
                  <Image src={currentCharacter.avatar} alt={currentCharacter.name} width={192} height={192} className="w-full h-full rounded-full object-cover" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-4">{currentCharacter.name}</h2>
              <p className="text-center text-gray-300 mb-8">{currentCharacter.introduction}</p>
              <button
                onClick={handleNextCharacter}
                disabled={isPlaying}
                className={`px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors 
                  ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentIndex < characters.length - 1 ? 'Next Character' : 'Start Game'}
              </button>
            </div>
          )}
        </div>

        {/* Right side characters */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            {characters.slice(Math.floor(characters.length/2)).map((char, index) => (
              <div 
                key={index + Math.floor(characters.length/2)}
                onClick={() => setCurrentIndex(index + Math.floor(characters.length/2))}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                  ${currentIndex === index + Math.floor(characters.length/2) ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <div className="w-20 h-20 rounded-full bg-gray-600 mb-2">
                  {char.avatar && <Image src={char.avatar} alt={char.name} width={80} height={80} className="w-full h-full rounded-full object-cover" />}
                </div>
                <span className="text-sm font-medium">{char.name}</span>
              </div>
            ))}
          </div>
        </div> 
      </div>
    </motion.div>
  );
};

export default IntroductionPhase; 