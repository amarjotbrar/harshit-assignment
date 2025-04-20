//modules
import Image from 'next/image';
//assets
import GameIcon from "@/assets/GameIcon.svg";
//types
import { Character } from "@/types/character";

interface IntroductionPhaseProps {
  characters: Character[];
}

const IntroductionPhase = (props: IntroductionPhaseProps) => {
  const { characters } = props;
  console.log(characters);/// will remove this, just for testing
  return (
      <div className="bg-black w-full h-screen max-h-screen overflow-auto p-4 space-y-4">
        {/* Title Bar */}
        <div className="flex items-center p-2 gap-8">
            <Image 
              src={GameIcon} 
              alt="Game Icon"
              width={68}
              height={56}
            />
        
          <span className="flex-1 text-lg font-bold border border-green-500 h-full flex items-center">Welcome To Sentient Struggle</span>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button className="border border-green-500 px-2 py-1">⏸</button>
            <button className="border border-green-500 px-2 py-1">▶️</button>
            <button className="border border-green-500 px-2 py-1">🔊</button>
          </div>
        </div>

        {/* Video Area */}
        <div className="border-2 border-cyan-400 h-[300px] w-full flex items-center justify-center text-cyan-400 text-sm">
          1376 x 532
        </div>

        {/* Dialogue Section */}
        <div className="border border-green-500 p-2 flex">
          {/* Character Avatar */}
          <div className="w-24 h-24 bg-gray-800 border border-green-500 mr-4" />

          {/* Text Area */}
          <div className="flex-1 overflow-y-auto max-h-28 pr-2">
            <p className="text-green-500">
              <span className="font-bold text-green-400">{'{Character_Name}'}:</span><br />
              Lorem ipsum dolor sit amet consectetur. Elementum amet orci quam senectus pulvinar dolor orci erat. 
              Consectetur dictum ullamcorper eget in. Sit eu phasellus iaculis molestie nullam phasellus et. 
              Aenean eget et facilisi.
            </p>
          </div>
        </div>
      </div>
  );
}

export default IntroductionPhase;