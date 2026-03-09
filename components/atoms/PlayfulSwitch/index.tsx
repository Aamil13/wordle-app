import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  enableHaptics?: boolean;
  theme: "dark" | "light";
};

const WIDTH = 64;
const HEIGHT = 36;
const KNOB = 30;
const PADDING = 3;

export default function PlayfulSwitch({
  value,
  onValueChange,
  theme = "dark",
  disabled = false,
  enableHaptics = false,
}: Props) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

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
          styles.track,
          {
            backgroundColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              backgroundColor: knobColor,
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

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    justifyContent: "center",
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  face: {
    fontSize: 16,
  },
});
