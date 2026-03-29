import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import bgSoundFile from "@/assets/sounds/bg.mp3";
import buttonSoundFile from "@/assets/sounds/button.mp3";

type AudioContextType = {
  play: () => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (value: number) => Promise<void>;
  isPlaying: boolean;
  playButtonSound: () => Promise<void>;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const bgSound = useRef<Audio.Sound | null>(null);
  const buttonSound = useRef<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      const sound = new Audio.Sound();
      const btn = new Audio.Sound();
      await sound.loadAsync(bgSoundFile, {
        isLooping: true,
        volume: 0.5,
      });
      await btn.loadAsync(buttonSoundFile, {
        volume: 1.0,
      });

      bgSound.current = sound;
      buttonSound.current = btn;
      setIsLoaded(true);
    };

    load();

    return () => {
      bgSound.current?.unloadAsync();
      buttonSound.current?.unloadAsync();
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

  const playButtonSound = async () => {
    if (!buttonSound.current) return;

    const status = await buttonSound.current.getStatusAsync();
    if (!status.isLoaded) return;

    try {
      // reset to start so it plays every time
      await buttonSound.current.setPositionAsync(0);
      await buttonSound.current.playAsync();
    } catch (e) {
      console.log("Button sound error:", e);
    }
  };

  const setVolume = async (value: number) => {
    if (!bgSound.current) return;
    await bgSound.current.setVolumeAsync(value);
  };

  return (
    <AudioContext.Provider
      value={{ play, stop, setVolume, isPlaying, playButtonSound }}
    >
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
