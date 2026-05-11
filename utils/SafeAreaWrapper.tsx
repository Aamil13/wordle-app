import React from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "./useTheme";
import { useBackHandler } from "@/hooks/useBackHandler";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const SafeAreaWrapper = ({ children, style }: Props) => {
  useBackHandler();
  const insets = useSafeAreaInsets();
  const color = useTheme();
  return (
    <View
      style={[
        {
          // paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
          flex: 1,
          backgroundColor: color.background,
        },

        style,
      ]}
    >
      {children}
    </View>
  );
};

export default SafeAreaWrapper;
