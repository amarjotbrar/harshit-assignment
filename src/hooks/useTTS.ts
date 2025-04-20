import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Howl } from 'howler';

// Placeholder for the Lemonfox API key that will be provided later
const LEMONFOX_API_KEY = process.env.NEXT_PUBLIC_LEMONFOX_API_KEY || 'YOUR_API_KEY';
const LEMONFOX_API_URL = 'https://api.lemonfox.ai/v1/speech';

interface UseTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
}

export const useTTS = (): UseTTSReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    try {
      // Stop any current audio
      stop();

      setIsPlaying(true);

      // In a real implementation, this would call the Lemonfox API
      // For now, we'll use a mock implementation that works without the actual API key
      // When the API key is provided, uncomment the real implementation below
      
      /*
      const response = await axios.post(
        LEMONFOX_API_URL,
        {
          text,
          voice_id: 'default', // Replace with appropriate voice ID
          output_format: 'mp3',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LEMONFOX_API_KEY}`,
          },
          responseType: 'arraybuffer',
        }
      );

      // Convert the binary data to a base64 string
      const audioData = Buffer.from(response.data).toString('base64');
      const audioSrc = `data:audio/mp3;base64,${audioData}`;
      */

      // For development without an API key, we'll use the browser's built-in speech synthesis
      // This will be replaced with the Lemonfox implementation when the API key is provided
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        return;
      }

      /* 
      // Uncomment when Lemonfox API key is available
      soundRef.current = new Howl({
        src: [audioSrc],
        format: ['mp3'],
        html5: true,
        onend: () => {
          setIsPlaying(false);
          soundRef.current = null;
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error);
          setIsPlaying(false);
          soundRef.current = null;
        },
        onplayerror: (id, error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          soundRef.current = null;
        }
      });

      soundRef.current.play();
      */
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
    }
  }, [stop]);

  return { speak, stop, isPlaying };
};

export default useTTS; 