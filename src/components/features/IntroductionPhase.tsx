//modules
import React from 'react';
//components
import TitleBar from '../ui/TitleBar';
//types
import { Character } from '@/types/character';

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
    <div className="h-screen max-h-screen w-full space-y-4 overflow-auto bg-black p-4">
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
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-[var(--neon-green)]">
        1376 x 532
      </div>

      {/* Dialogue Section */}
      <div className="flex rounded-lg border border-[var(--neon-green)] p-8">
        {/* Character Avatar */}
        <div className="mr-4 h-64 w-64 border border-[var(--neon-green)] rounded-lg" />

        {/* Text Area */}
        <div className="flex-1 overflow-y-auto pr-2">
          <span className="font-['Press_Start_2P'] text-md">{currentCharacter.name}:</span>
          <br />
          <p className="font-['Press_Start_2P'] text-sm">{currentCharacter.introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPhase;
