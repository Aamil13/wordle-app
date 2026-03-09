import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

import shuffleSound from "@/assets/sounds/shuffle.mp3";
import successChime from "@/assets/sounds/success-chime.mp3";
import warningSoundFile from "@/assets/sounds/warning.mp3";

import trumpetsSound from "@/assets/sounds/trumpets.mp3";
import failSoundFile from "@/assets/sounds/fail.mp3";

export const useSounds = () => {
  // 🎮 Game sounds
  const flipSound = useRef<Audio.Sound | null>(null);
  const successSound = useRef<Audio.Sound | null>(null);
  const warningSound = useRef<Audio.Sound | null>(null);

  // 🏁 Game Over sounds
  const trumpetSound = useRef<Audio.Sound | null>(null);
  const failSound = useRef<Audio.Sound | null>(null);

  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [isGameOverLoaded, setIsGameOverLoaded] = useState(false);

  /* =========================
     GAME SOUNDS
  ========================== */

  const loadGameSounds = async () => {
    try {
      flipSound.current = new Audio.Sound();
      successSound.current = new Audio.Sound();
      warningSound.current = new Audio.Sound();

      await flipSound.current.loadAsync(shuffleSound);
      await successSound.current.loadAsync(successChime);
      await warningSound.current.loadAsync(warningSoundFile);

      setIsGameLoaded(true);
    } catch (e) {
      console.log("Error loading game sounds:", e);
    }
  };

  const unloadGameSounds = async () => {
    await flipSound.current?.unloadAsync();
    await successSound.current?.unloadAsync();
    await warningSound.current?.unloadAsync();
  };

  /* =========================
     GAME OVER SOUNDS
  ========================== */

  const loadGameOverSounds = async () => {
    try {
      trumpetSound.current = new Audio.Sound();
      failSound.current = new Audio.Sound();

      await trumpetSound.current.loadAsync(trumpetsSound);
      await failSound.current.loadAsync(failSoundFile);

      setIsGameOverLoaded(true);
    } catch (e) {
      console.log("Error loading game over sounds:", e);
    }
  };

  const unloadGameOverSounds = async () => {
    await trumpetSound.current?.unloadAsync();
    await failSound.current?.unloadAsync();
  };

  /* =========================
     SAFE PLAY
  ========================== */

  const safePlay = async (sound: Audio.Sound | null, isLoaded: boolean) => {
    if (!sound || !isLoaded) return;

    try {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (e) {
      console.log("Sound playback error:", e);
    }
  };

  const playFlip = () => safePlay(flipSound.current, isGameLoaded);
  const playSuccess = () => safePlay(successSound.current, isGameLoaded);
  const playWarning = () => safePlay(warningSound.current, isGameLoaded);

  const playTrumpet = () => safePlay(trumpetSound.current, isGameOverLoaded);

  const playFail = () => safePlay(failSound.current, isGameOverLoaded);

  useEffect(() => {
    return () => {
      unloadGameSounds();
      unloadGameOverSounds();
    };
  }, []);

  return {
    // game
    loadGameSounds,
    unloadGameSounds,
    playFlip,
    playSuccess,
    playWarning,
    isGameLoaded,

    // game over
    loadGameOverSounds,
    unloadGameOverSounds,
    playTrumpet,
    playFail,
    isGameOverLoaded,
  };
};
