import Animated, { FadeInDown } from "react-native-reanimated";

export default function AuthContainer({ children }: any) {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={{ flex: 1 }}>
      {children}
    </Animated.View>
  );
}
