import { TranscriptItem, GameStateMessageData } from '@/types/transcript';
import { Direction } from '@/types';
import { Character } from '@/types/character';


// Process transcript to extract character data for introduction phase
export const extractCharacters = (transcript: TranscriptItem[]): Character[] => {
  const agentOrderMessage = transcript.find(item => item.id === 1165)?.message_data as GameStateMessageData;

  const orderedCharacters = Object.entries(agentOrderMessage.agent_order)
  .sort((a, b) => a[1] - b[1])
  .map(([name]) => ({
    name,
    introduction: `This is ${name}'s introduction.`,
    avatar: `https://placehold.co/600x400`,
    isAlive: true
  }));
  
  return orderedCharacters;
};

// Process the gameplay transcript to determine safe and unsafe tiles
export const processBridgeTiles = (gameplayTranscript: TranscriptItem[]): {
  left: boolean[];
  right: boolean[];
} => {
  const bridgeLength = 18; // Based on the Figma design
  const leftTiles: boolean[] = Array(bridgeLength).fill(false);
  const rightTiles: boolean[] = Array(bridgeLength).fill(false);
  
  let currentPosition = 0;
  
  gameplayTranscript.forEach(item => {
    if (item.message_type === 'game_state') {
      const gameStateData = item.message_data as GameStateMessageData;
      
      if (gameStateData.attempt_history && gameStateData.attempt_history.length > 0) {
        // Get the most recent attempt
        const latestAttempt = gameStateData.attempt_history[gameStateData.attempt_history.length - 1];
        
        if (latestAttempt && latestAttempt.choice && latestAttempt.result && currentPosition < bridgeLength) {
          const direction = latestAttempt.choice as Direction;
          const isSafe = latestAttempt.result === 'success';
          
          if (direction === 'left') {
            leftTiles[currentPosition] = isSafe;
          } else {
            rightTiles[currentPosition] = isSafe;
          }
          
          if (isSafe) {
            currentPosition++;
          }
        }
      }
    }
  });
  
  return { left: leftTiles, right: rightTiles };
}; 