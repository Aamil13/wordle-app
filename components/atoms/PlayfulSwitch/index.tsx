import { Colors } from "@/constants/Colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  enableHaptics?: boolean;
  size?: "small" | "medium" | "large";
};

const SIZES = {
  small: { width: 48, height: 28, knob: 22 },
  medium: { width: 64, height: 36, knob: 30 },
  large: { width: 80, height: 44, knob: 36 },
};

const PADDING = 3;

export default function PlayfulSwitch({
  value,
  onValueChange,
  size = "medium",
  disabled = false,
  enableHaptics = false,
}: Props) {
  const theme = useAppStore((state) => state.theme);
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  const { width: WIDTH, height: HEIGHT, knob: KNOB } = SIZES[size];

  const activeColor = Colors[theme].switchActive;
  const inactiveColor = Colors[theme].switchInactive;
  const knobColor = Colors[theme].switchKnob;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 5,
      tension: 120,
    }).start();
  }, [value]);

  const handleToggle = async () => {
    if (disabled) return;

    if (enableHaptics) {
      await Haptics.selectionAsync();
    }

    onValueChange(!value);
  };

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, WIDTH - KNOB - PADDING],
  });

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1], // little pop when active
  });

  return (
    <Pressable onPress={handleToggle} disabled={disabled}>
      <Animated.View
        style={[
          {
            width: WIDTH,
            height: HEIGHT,
            borderRadius: HEIGHT / 2,
            justifyContent: "center",
            backgroundColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              width: KNOB,
              height: KNOB,
              borderRadius: KNOB / 2,
              backgroundColor: knobColor,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 3 },
              elevation: 4,
              transform: [{ translateX }, { scale }],
            },
          ]}
        >
          {/*<Text style={styles.face}>{value ? "😄" : "😴"}</Text>*/}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
