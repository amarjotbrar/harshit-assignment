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
  onNextPhase: () => void;
  isMuted: boolean;
  isPlaying: boolean;
  onMuteToggle: () => void;
  onPlayToggle: () => void;
}

const IntroductionPhase = (props: IntroductionPhaseProps) => {
  const { characters, isMuted, isPlaying, onMuteToggle, onPlayToggle, onNextPhase } = props;

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
        onPreviousStep={onPreviousCharacter}
        onPlayToggle={onPlayToggle}
        onNextStep={onNextCharacter}
        onFastForward={onFastForward}
        onMuteToggle={onMuteToggle}
        isMuted={isMuted}
        isPlaying={isPlaying}
      />

      {/* Video Area */}
      <div className="flex w-full flex-1 items-center justify-around rounded-lg border border-[var(--neon-green)]">
        <div
          className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: 'cover', // Ensures the image covers the area without stretching
            backgroundPosition: 'center', // Keeps the image centered
            height: '50vh', // Sets the height of the background image to 50% of the viewport height
          }}
        >
          {/* Background image */}
          <div className="game-background"></div>

          {/* Pixelated overlay effect */}
          <div className="pixelated-overlay"></div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
            <h1 className="mb-8 text-5xl font-bold text-green-500">Glass Bridge Challenge</h1>
            <p className="mb-8 max-w-md px-4 text-center text-green-400">
              Choose the correct glass tile to cross the bridge. One tile is tempered and will hold
              your weight, the other will break. Use arrow keys or click to select.
            </p>
            {currentCharacterIndex === characters.length - 1 && (
              <button
                onClick={onNextPhase}
                className="rounded-md bg-green-500 px-8 py-4 text-xl font-bold text-black transition-colors hover:bg-green-400"
              >
                Start Game
              </button>
            )}
          </div>
        </div>
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
          <span className="font-['Press_Start_2P'] text-sm">{currentCharacter.name}:</span>
          <br />
          <p className="font-['Press_Start_2P'] text-xs">{currentCharacter.introduction}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPhase;
