import { motion } from 'framer-motion';
import { Character as CharacterType } from '../types';
import Image from 'next/image';

interface CharacterProps {
  character: CharacterType;
  isActive: boolean;
  onComplete?: () => void;
}

const Character = ({ character, isActive, onComplete }: CharacterProps) => {
  const defaultAvatarUrl = '/default-avatar.png'; // Add a default avatar image to public folder

  return (
    <motion.div
      className={`flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-50'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={isActive ? onComplete : undefined}
    >
      <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-800">
        {character.avatar ? (
          <Image 
            src={character.avatar} 
            alt={character.name} 
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-600 text-xl font-bold">
            {character.name.charAt(0)}
          </div>
        )}
      </div>
      
      <motion.h3
        className="text-xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0.5 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {character.name}
      </motion.h3>
      
      {isActive && (
        <motion.p
          className="text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {character.introduction}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Character; 