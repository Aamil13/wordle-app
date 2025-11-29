import React from "react";
import { Text as RNText, StyleProp, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  size?: number; // Font size
  color?: string; // Font color
  style?: StyleProp<TextStyle>;
}

export const CustomText: React.FC<CustomTextProps> = ({
  size = 16, // default font size
  color = "#333", // default font color
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      {...props}
      style={[{ fontFamily: "jumpsWinter", fontSize: size, color }, style]}
    >
      {children}
    </RNText>
  );
};
