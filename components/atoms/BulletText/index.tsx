import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextProps, useColorScheme, View } from "react-native";
import { CustomText } from "../customText";

interface BulletTextProps extends TextProps {
  size?: number;
  color?: string;
  gap?: number; // space between bullet + text
}

export const BulletText: React.FC<BulletTextProps> = ({
  size = 20,
  color,
  gap = 8,
  children,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const defaultColor = Colors[colorScheme || "dark"].text;

  return (
    <View style={styles.row}>
      <CustomText size={size} color={color ?? defaultColor}>
        •
      </CustomText>

      <CustomText
        size={size}
        color={color ?? defaultColor}
        style={[{ marginLeft: gap }, style]}
        {...props}
      >
        {children}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
});
