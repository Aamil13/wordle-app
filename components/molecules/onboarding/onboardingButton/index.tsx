import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

interface OnboardingButtonProps {
  onPress: () => void;
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  onPress,
  text,
  backgroundColor = "white",
  textColor = "#000",
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(4);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, {
      damping: 5,
      stiffness: 150,
      mass: 0.5,
    });
    rotation.value = withSequence(
      withSpring(-8, { damping: 8, stiffness: 300 }),
      withSpring(0, { damping: 8, stiffness: 300 })
    );
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.15, {
        damping: 4,
        stiffness: 200,
        mass: 0.3,
      }),
      withSpring(1, {
        damping: 6,
        stiffness: 180,
        mass: 0.5,
      })
    );
    rotation.value = withSequence(
      withSpring(8, { damping: 8, stiffness: 300 }),
      withSpring(4, { damping: 8, stiffness: 300 })
    );
  };

  return (
    <Animated.View style={[styles.container, buttonStyle]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor }]}
      >
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 18,

    fontFamily: "jumpsWinter",
  },
});
