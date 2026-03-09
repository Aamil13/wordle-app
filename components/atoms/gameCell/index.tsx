import { useTheme } from "@/utils/useTheme";
import React from "react";
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  View,
} from "react-native";

type CellStatus = "empty" | "green" | "yellow" | "gray";

interface GameCellInterface extends TextProps {
  size?: number;
  status?: CellStatus;
  style?: StyleProp<TextStyle>;
  isActive?: boolean;
}

export const GameCell: React.FC<GameCellInterface> = ({
  size = 16,
  status = "empty",
  style,
  children,
  isActive = false,
  ...props
}) => {
  const theme = useTheme();

  const backgroundColor =
    status === "green"
      ? theme.green
      : status === "yellow"
        ? theme.yellow
        : status === "gray"
          ? theme.gray
          : theme.cellEmpty;

  const textColor = status === "empty" ? theme.text : "#fff";

  const borderColor =
    status === "empty" ? theme.separatorColor : backgroundColor;

  const activeBorderWidth = isActive ? 3 : 2;

  const finalBorderColor = isActive ? theme.activeBorder : borderColor;

  return (
    <View
      style={[
        styles.cell,
        {
          backgroundColor,
          borderColor: finalBorderColor,
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
