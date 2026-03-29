import LottieView, { AnimationObject } from "lottie-react-native";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
  source: AnimationObject;
  height?: number;
  width?: number;
  autoPlay?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function LottieAnimation({
  source,
  height = 200,
  width,
  autoPlay = true,
  loop = true,
  style,
}: Props) {
  return (
    <LottieView
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      style={[{ height, width }, style]}
    />
  );
}
