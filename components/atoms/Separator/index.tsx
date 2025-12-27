import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export const Separator = ({ width = 2 }: { width?: number }) => {
  const colorScheme = useColorScheme();
  const separatorColor = Colors[colorScheme || "dark"].separatorColor;

  return (
    <View style={styles.seperatorView}>
      <View
        style={{
          flex: 1,
          borderBottomColor: separatorColor,
          borderBottomWidth: width,
        }}
      />
      <Text style={[styles.seperator, { color: separatorColor }]}>OR</Text>
      <View
        style={{
          flex: 1,
          borderBottomColor: separatorColor,
          borderBottomWidth: width,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    // color: Colors.light.gray,
    fontSize: 16,
    fontFamily: "jumpsWinter",
  },
});
