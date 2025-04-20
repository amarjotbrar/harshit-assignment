//modules
import React from 'react';
//components
import TitleBar from './ui/TitleBar';
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

  console.log(characters); /// will remove this, just for testing
  console.log(currentCharacter); /// will remove this, just for testing

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
      <div className="flex border border-[var(--neon-green)] rounded-lg p-8">
        {/* Character Avatar */}
        <div className="mr-4 h-24 w-24 border border-green-500 bg-gray-800" />

        {/* Text Area */}
        <div className="max-h-28 flex-1 overflow-y-auto pr-2">
          <p className="text-green-500">
            <span className="font-bold text-green-400">{'{Character_Name}'}:</span>
            <br />
            Lorem ipsum dolor sit amet consectetur. Elementum amet orci quam senectus pulvinar dolor
            orci erat. Consectetur dictum ullamcorper eget in. Sit eu phasellus iaculis molestie
            nullam phasellus et. Aenean eget et facilisi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPhase;
