import { memo, useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

type Props = {
  color: string;
};

const AnimatedLeaderboardIcon = memo(({ color }: Props) => {
  const bar1 = useRef(new Animated.Value(0)).current;
  const bar2 = useRef(new Animated.Value(0)).current;
  const bar3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeAnim = (
      val: Animated.Value,
      toValue: number,
      duration: number,
      delay: number
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );

    const a1 = makeAnim(bar1, 0.35, 500, 0);
    const a2 = makeAnim(bar2, 0.5, 700, 150);
    const a3 = makeAnim(bar3, 0.25, 600, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  const maxHeight = 18;
  const minHeight = 5;
  const barWidth = 5;

  const h1 = bar1.interpolate({ inputRange: [0, 1], outputRange: [minHeight, maxHeight] });
  const h2 = bar2.interpolate({ inputRange: [0, 1], outputRange: [minHeight, maxHeight] });
  const h3 = bar3.interpolate({ inputRange: [0, 1], outputRange: [minHeight, maxHeight] });

  return (
    <View
      style={{
        width: 26,
        height: 26,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 3,
        paddingTop:50
      }}
    >
      <Animated.View style={{ width: barWidth, height: h1, backgroundColor: color, borderRadius: 2 }} />
      <Animated.View style={{ width: barWidth, height: h2, backgroundColor: color, borderRadius: 2 }} />
      <Animated.View style={{ width: barWidth, height: h3, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
});

AnimatedLeaderboardIcon.displayName = "AnimatedLeaderboardIcon";

export default AnimatedLeaderboardIcon;
