import { CustomText } from "@/components/atoms/customText";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Slide({
  item,
  index,
  scrollX,
}: {
  item: {
    animation: any;
    bgColor: string;
    textColor: string;
    descriptionColor: string;
    text: string;
    description: string;
    id: number;
  };
  index: number;
  scrollX: any;
}) {
  // --- Animated Style (safe to use hook here) ---
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.6, 1, 0.6],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: item.bgColor,
        },
        animatedStyle,
      ]}
    >
      <LottieView
        key={item.id}
        source={item.animation}
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />

      {/* <Text
        style={{
          color: item.textColor,
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        {item.text}
      </Text> */}
      <CustomText size={28} color={item.textColor} style={{ marginTop: 20 }}>
        {item.text}
      </CustomText>

      {/* <Text
        style={{
          color: item.descriptionColor,
          marginTop: 10,
          fontSize: 16,
          textAlign: "center",
          width: "80%",
        }}
      >
        {item.description}
      </Text> */}
      <CustomText
        size={28}
        color={item.descriptionColor}
        style={{ marginTop: 10, textAlign: "center", width: "80%" }}
      >
        {item.description}
      </CustomText>
    </Animated.View>
  );
}
