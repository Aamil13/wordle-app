import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface DotProps {
  isActive: boolean;
  activeDotColor: string;
  inactiveDotColor: string;
}

export const Dot: React.FC<DotProps> = ({
  isActive,
  activeDotColor,
  inactiveDotColor,
}) => {
  const dotStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isActive ? 22 : 8, {
        damping: 15,
        stiffness: 100,
      }),
      opacity: withTiming(isActive ? 1 : 0.5, {
        duration: 300,
      }),
      backgroundColor: isActive ? activeDotColor : inactiveDotColor,
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
});
