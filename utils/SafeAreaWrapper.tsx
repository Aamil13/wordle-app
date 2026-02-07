import React from "react";
import { useColorScheme, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const SafeAreaWrapper = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
          flex: 1,
          //   backgroundColor: scheme === "dark" ? "#000" : "#fff",
        },

        style,
      ]}
    >
      {children}
    </View>
  );
};

export default SafeAreaWrapper;
