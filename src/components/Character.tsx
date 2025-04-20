import Image from 'next/image';
import { Character as CharacterType } from '../types';

interface CharacterProps {
  character: CharacterType;
}

const Character = ({ character }: CharacterProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
        {character.avatar ? (
          <Image 
            src={character.avatar} 
            alt={character.name} 
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-600 text-xl font-bold">
            {character.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium text-white">
        {character.name}
      </h3>
    </div>
  );
};

export default Character; 