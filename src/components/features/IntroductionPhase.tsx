//modules
import React from 'react';
import Image from 'next/image';
//components
import TitleBar from '../ui/TitleBar';
//types
import { Character } from '@/types/character';
//constants
import { CHARACTER_AVATAR_MAP } from '@/constants/character';
import GlassBridgeGame from '../glass-bridge-game';

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
    setCurrentCharacterIndex((prevIndex) => Math.min(prevIndex + 1, characters.length - 1));
  };

  const onPreviousCharacter = () => {
    setCurrentCharacterIndex((prevIndex) => Math.max(0, prevIndex - 1));
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
      <div className="flex w-full flex-1 items-center justify-around rounded-lg border border-[var(--neon-green)]">
        <GlassBridgeGame />
      </div>

      {/* Dialogue Section */}
      <div className="flex rounded-lg border border-[var(--neon-green)] p-8">
        {/* Character Avatar */}
        <Image
          src={CHARACTER_AVATAR_MAP[currentCharacter.name]}
          alt={currentCharacter.name}
          className="mr-8 max-h-64 w-64 rounded-lg border border-[var(--neon-green)] p-2"
        />

        {/* Text Area */}
        <div className="max-h-64 flex-1 overflow-y-auto pr-2">
          <span className="text-sm font-['Press_Start_2P']">{currentCharacter.name}:</span>
          <br />
          <p className="font-['Press_Start_2P'] text-xs">{currentCharacter.introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPhase;
