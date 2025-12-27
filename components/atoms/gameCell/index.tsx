import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  useColorScheme,
  View,
} from "react-native";

type CellStatus = "empty" | "green" | "yellow" | "gray";

interface GameCell extends TextProps {
  size?: number;
  status?: CellStatus;
  style?: StyleProp<TextStyle>;
  isActive?: boolean;
}

export const GameCell: React.FC<GameCell> = ({
  size = 16,
  status = "empty",
  style,
  children,
  isActive = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || "dark"];

  const backgroundColor =
    status === "green"
      ? "#4CAF50"
      : status === "yellow"
        ? "#FFC107"
        : status === "gray"
          ? "#616161"
          : colorScheme === "dark"
            ? "#3a3a3c"
            : "#f0ebebff";

  const textColor = status === "empty" ? theme.text : "#fff";

  const borderColor =
    status === "empty" ? theme.separatorColor : backgroundColor;

  // Active cell gets thicker, brighter border
  const activeBorderWidth = isActive ? 3 : 2;
  const activeBorderColor = isActive
    ? colorScheme === "dark"
      ? "#60A5FA"
      : "#3B82F6"
    : borderColor;

  return (
    <View
      style={[
        styles.cell,
        {
          backgroundColor,
          borderColor: activeBorderColor,
          borderWidth: activeBorderWidth,
        },
      ]}
    >
      <RNText
        {...props}
        style={[
          {
            fontFamily: "jumpsWinter",
            fontSize: size,
            color: textColor,
          },
          style,
        ]}
      >
        {children}
      </RNText>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
