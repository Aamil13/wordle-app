import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Text as RNText,
  StyleProp,
  TextProps,
  TextStyle,
  useColorScheme,
} from "react-native";

interface CustomTextProps extends TextProps {
  size?: number; // Font size
  color?: string; // Font color
  style?: StyleProp<TextStyle>;
}

export const CustomText: React.FC<CustomTextProps> = ({
  size = 16, // default font size
  color, // default font color
  style,
  children,
  ...props
}) => {
  const colorScheme = useColorScheme();

  const defaultColor = Colors[colorScheme || "dark"].text;
  if (!color) {
    color = defaultColor;
  }

  return (
    <RNText
      {...props}
      style={[{ fontFamily: "jumpsWinter", fontSize: size, color }, style]}
    >
      {children}
    </RNText>
  );
};
