//modules
import Image from 'next/image';
//assets
import GameIcon from '@/assets/game_icon.svg';
import ForwardIcon from '@/assets/forward.svg';
import FastForwardIcon from '@/assets/fast_forward.svg';
import MuteIcon from '@/assets/mute.svg';
import UnmuteIcon from '@/assets/unmute.svg';
import PlayIcon from '@/assets/play.svg';
import PauseIcon from '@/assets/pause.svg';
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
  console.log(characters); /// will remove this, just for testing
  return (
    <div className="h-screen max-h-screen w-full space-y-4 overflow-auto bg-black p-4">
      {/* Title Bar */}
      <div className="flex items-center gap-8">
        <Image src={GameIcon} alt="Game Icon" width={68} height={56} />

        <span className="flex h-full flex-1 items-center rounded-lg border border-[var(--neon-green)] p-3 font-['Press_Start_2P'] text-lg">
          Welcome To Sentient Struggle
        </span>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button className="rotate-180">
            <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
          </button>
          <button className="rotate-180">
            <Image src={ForwardIcon} alt="Forward" height={26} />
          </button>
          <button onClick={onPlayToggle}>
            <Image src={isPlaying ? PauseIcon : PlayIcon} alt="Play" height={26} />
          </button>
          <button>
            <Image src={ForwardIcon} alt="Forward" height={26} />
          </button>
          <button>
            <Image src={FastForwardIcon} alt="Fast Forward" height={26} />
          </button>
          <button onClick={onMuteToggle}>
            <Image src={isMuted ? MuteIcon : UnmuteIcon} alt="Mute" height={26} />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex h-[300px] w-full items-center justify-center border-2 border-cyan-400 text-sm text-cyan-400">
        1376 x 532
      </div>

      {/* Dialogue Section */}
      <div className="flex border border-green-500 p-2">
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
