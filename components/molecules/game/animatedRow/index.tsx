import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  animation: "idle" | "shake" | "row-enter";
};

const AnimatedRow = ({ children, animation }: Props) => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  React.useEffect(() => {
    if (animation === "shake") {
      offsetX.value = withSequence(
        withTiming(-15, { duration: 40 }),
        withRepeat(withTiming(15, { duration: 70 }), 5, true),
        withTiming(0, { duration: 40 }),
      );
    }

    if (animation === "row-enter") {
      offsetY.value = withSequence(
        withTiming(20, { duration: 0 }),
        withTiming(0, { duration: 200 }),
      );
    }
  }, [animation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

export default AnimatedRow;
