import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
} from "react-native-reanimated";
import { GameCell } from "@/components/atoms/gameCell";

type Props = {
  letter: string;
  state: "green" | "yellow" | "gray" | "empty";
  index: number;
  animation: "flip" | "success" | "idle";
};

const AnimatedCell = ({ letter, state, index, animation }: Props) => {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const background = useSharedValue("transparent");
  const border = useSharedValue("#ccc");

  React.useEffect(() => {
    if (animation === "flip") {
      const color =
        state === "green"
          ? "#22c55e"
          : state === "yellow"
            ? "#eab308"
            : "#6b7280";

      rotate.value = withDelay(
        index * 120,
        withSequence(
          withTiming(90, { duration: 200 }),
          withTiming(0, { duration: 200 }),
        ),
      );

      background.value = withDelay(index * 120, withTiming(color));
      border.value = withDelay(index * 120, withTiming(color));
    }

    if (animation === "success") {
      scale.value = withDelay(
        index * 80,
        withSequence(
          withTiming(1.2, { duration: 120 }),
          withTiming(1, { duration: 120 }),
        ),
      );
    }
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateX: `${rotate.value}deg` }, { scale: scale.value }],
    backgroundColor: background.value,
    borderColor: border.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <GameCell status={state}>{letter}</GameCell>
    </Animated.View>
  );
};

export default AnimatedCell;
