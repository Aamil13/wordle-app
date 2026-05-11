import { useAppStore } from "@/store";
import { useEffect, useState, useCallback } from "react";

const COOLDOWN = 30;

type Props = {
  onPress?: () => void;
  onStateChange?: (value: boolean) => void;
};

export const useResendTimer = ({ onPress, onStateChange }: Props) => {
  const lastTriggeredAt = useAppStore((s) => s.lastTriggeredAt);
  const setLastTriggeredAt = useAppStore((s) => s.setLastTriggeredAt);

  const [now, setNow] = useState(Date.now());

  // Tick every second (but we don't store seconds directly)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const secondsLeft = lastTriggeredAt
    ? Math.max(0, COOLDOWN - Math.floor((now - lastTriggeredAt) / 1000))
    : 0;

  const isActive = secondsLeft > 0;

  // Notify parent
  useEffect(() => {
    onStateChange?.(isActive);
  }, [isActive, onStateChange]);

  const trigger = useCallback(() => {
    if (isActive) return;

    const nowTime = Date.now();
    setLastTriggeredAt(nowTime);

    onPress?.();
  }, [isActive, setLastTriggeredAt, onPress]);

  return {
    secondsLeft,
    isActive,
    trigger,
  };
};
