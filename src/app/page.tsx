'use client';
//modules
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
//components
import IntroductionPhase from '@/components/features/IntroductionPhase';
// import GameplayPhase from '@/components/GameplayPhase';
// import ResultsPhase from '@/components/ResultsPhase';
//utils
// import GlassBridgeGame from '@components/glass-bridge-game';
import { extractCharacters } from '@/utils/gameplay';
//types
import { Character } from '@/types/character';
import { TranscriptItem } from '@/types/transcript';
//services
import transcriptService from '@/services/transcriptService';

export default function Home() {
  const [phase, setPhase] = useState<'loading' | 'introduction' | 'gameplay' | 'results'>(
    'loading'
  );
  const [characters, setCharacters] = useState<Character[]>([]);
  const [gameplayTranscript, setGameplayTranscript] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: transcript } = await transcriptService.getTranscript();

        if (transcript.length === 0) {
          throw new Error('Failed to fetch transcript data');
        }

        const extractedCharacters = extractCharacters(transcript);

        const startIndex = transcript.findIndex((item) => item.id === 1167);
        const gameTranscript = startIndex !== -1 ? transcript.slice(startIndex) : [];

        setCharacters(extractedCharacters);
        setGameplayTranscript(gameTranscript);
        setPhase('introduction');
      } catch (err) {
        console.error('Error setting up game:', err);
        setError('Failed to load game data. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log(gameplayTranscript); /////////////////////////////////////////////////Need to remove this

  // Handle phase transitions
  // const handleIntroductionComplete = () => {
  //   setPhase('gameplay');
  // };

  const toggleMute = () => {
    setIsMuted((prevState) => !prevState);
  };

  const togglePlay = () => {
    setIsPlaying((prevState) => !prevState);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        <p>Loading game data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div className="max-w-md rounded-lg border border-red-600 bg-red-900/30 p-6">
          <h2 className="mb-2 text-xl font-bold">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-600 px-4 py-2 transition-colors hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <AnimatePresence mode="wait">
        {phase === 'introduction' && (
          <IntroductionPhase
            key="introduction"
            characters={characters}
            isMuted={isMuted}
            isPlaying={isPlaying}
            onMuteToggle={toggleMute}
            onPlayToggle={togglePlay}
            // onComplete={handleIntroductionComplete}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
