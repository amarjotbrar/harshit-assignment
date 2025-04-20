//modules
import React from 'react';
import Image from 'next/image';
//components
import TitleBar from '../ui/TitleBar';
//types
import { Character } from '@/types/character';
//constants
import { CHARACTER_AVATAR_MAP } from '@/constants/character';

interface IntroductionPhaseProps {
  characters: Character[];
  isMuted: boolean;
  isPlaying: boolean;
  onMuteToggle: () => void;
  onPlayToggle: () => void;
}

const IntroductionPhase = (props: IntroductionPhaseProps) => {
  const { characters, isMuted, isPlaying, onMuteToggle, onPlayToggle } = props;

  const [currentCharacterIndex, setCurrentCharacterIndex] = React.useState<number>(0);

  const currentCharacter = React.useMemo(
    () => characters[currentCharacterIndex],
    [characters, currentCharacterIndex]
  );

  const onNextCharacter = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
  };

  const onPreviousCharacter = () => {
    setCurrentCharacterIndex(
      (prevIndex) => (prevIndex - 1 + characters.length) % characters.length
    );
  };

  const onFastForward = () => {
    setCurrentCharacterIndex(characters.length - 1);
  };

  const onRewind = () => {
    setCurrentCharacterIndex(0);
  };

  return (
    <div className="flex h-screen w-full flex-col space-y-8 overflow-auto bg-black p-8">
      <TitleBar
        onRewind={onRewind}
        onPreviousCharacter={onPreviousCharacter}
        onPlayToggle={onPlayToggle}
        onNextCharacter={onNextCharacter}
        onFastForward={onFastForward}
        onMuteToggle={onMuteToggle}
        isMuted={isMuted}
        isPlaying={isPlaying}
      />

      {/* Video Area */}
      <div className="flex flex-1 w-full items-center justify-center rounded-lg border border-[var(--neon-green)]">
        1376 x 532
      </div>

      {/* Dialogue Section */}
      <div className="flex rounded-lg border border-[var(--neon-green)] p-8">
        {/* Character Avatar */}
        <Image
          src={CHARACTER_AVATAR_MAP[currentCharacter.name]}
          alt={currentCharacter.name}
          className="mr-8 h-64 w-64 border border-[var(--neon-green)] rounded-lg p-2"
        />

        {/* Text Area */}
        <div className="max-h-64 flex-1 overflow-y-auto pr-2">
          <span className="font-['Press_Start_2P'] text-md">{currentCharacter.name}:</span>
          <br />
          <p className="font-['Press_Start_2P'] text-sm">{currentCharacter.introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPhase;
