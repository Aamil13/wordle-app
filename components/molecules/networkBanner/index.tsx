import { useNetwork } from "@/context/network";
import { View, Text, StyleSheet } from "react-native";

export default function NetworkBanner() {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    padding: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});
