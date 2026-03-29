import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import bgSoundFile from "@/assets/sounds/bg.mp3";

type AudioContextType = {
  play: () => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (value: number) => Promise<void>;
  isPlaying: boolean;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const bgSound = useRef<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      const sound = new Audio.Sound();

      await sound.loadAsync(bgSoundFile, {
        isLooping: true,
        volume: 0.5,
      });

      bgSound.current = sound;
      setIsLoaded(true);
    };

    load();

    return () => {
      bgSound.current?.unloadAsync();
    };
  }, []);

  const play = async () => {
    if (!bgSound.current || !isLoaded) return;

    const status = await bgSound.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (!status.isPlaying) {
      await bgSound.current.playAsync();
      setIsPlaying(true);
    }
  };

  const stop = async () => {
    if (!bgSound.current) return;

    const status = await bgSound.current.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await bgSound.current.stopAsync();
      setIsPlaying(false);
    }
  };

  const setVolume = async (value: number) => {
    if (!bgSound.current) return;
    await bgSound.current.setVolumeAsync(value);
  };

  return (
    <AudioContext.Provider value={{ play, stop, setVolume, isPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used inside AudioProvider");
  }
  return context;
};
