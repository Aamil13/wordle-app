import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { useAppStore } from "@/store";
import { Colors } from "@/constants/Colors";

type Props = {
  error?: string;
  style?: TextStyle;
};

const FormError: React.FC<Props> = ({ error, style }) => {
  const colorScheme = useAppStore((state) => state.theme);
  const theme = Colors[colorScheme || "dark"];

  if (!error) return null;

  return (
    <Text style={[styles.errorText, { color: theme.error }, style]}>
      {error}
    </Text>
  );
};

export default FormError;

const styles = StyleSheet.create({
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
