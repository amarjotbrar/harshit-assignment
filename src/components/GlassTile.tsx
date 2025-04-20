import { motion } from 'framer-motion';

interface GlassTileProps {
  isSafe?: boolean;
  isRevealed: boolean;
  position: number;
  onClick?: () => void;
  isActive: boolean;
}

const GlassTile = ({ 
  isSafe = false, 
  isRevealed = false, 
  position, 
  onClick, 
  isActive 
}: GlassTileProps) => {
  return (
    <motion.div
      className={`
        relative h-20 w-full rounded-md cursor-pointer
        ${isActive ? 'z-10' : 'z-0'}
        ${isRevealed 
          ? (isSafe 
              ? 'bg-green-500/70 border-green-600' 
              : 'bg-red-500/70 border-red-600')
          : 'bg-gray-200/20 border-gray-300/40 hover:bg-gray-200/30'
        }
        border-2 backdrop-blur-sm transition-colors
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.05 : 1
      }}
      transition={{ 
        delay: position * 0.1,
        duration: 0.3
      }}
    >
      {/* Glass reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20 rounded-t-sm" />
    </motion.div>
  );
};

export default GlassTile; 