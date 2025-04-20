import { motion } from 'framer-motion';
import GlassTile from './GlassTile';

interface BridgeProps {
  tiles: {
    left: boolean[];
    right: boolean[];
  };
  revealedTiles: {
    left: boolean[];
    right: boolean[];
  };
  currentPosition: number;
  onTileClick?: (direction: 'left' | 'right', position: number) => void;
}

const Bridge = ({ 
  tiles, 
  revealedTiles, 
  currentPosition,
  onTileClick
}: BridgeProps) => {
  return (
    <div className="w-full max-w-4xl">
      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left column of tiles */}
        <div className="flex flex-col gap-6">
          {tiles.left.map((isSafe, index) => (
            <GlassTile
              key={`left-${index}`}
              isSafe={isSafe}
              isRevealed={revealedTiles.left[index]}
              position={index}
              isActive={index === currentPosition}
              onClick={() => onTileClick && onTileClick('left', index)}
            />
          ))}
        </div>
        
        {/* Right column of tiles */}
        <div className="flex flex-col gap-6">
          {tiles.right.map((isSafe, index) => (
            <GlassTile
              key={`right-${index}`}
              isSafe={isSafe}
              isRevealed={revealedTiles.right[index]}
              position={index}
              isActive={index === currentPosition}
              onClick={() => onTileClick && onTileClick('right', index)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Bridge; 