import { CustomText } from "@/components/atoms/customText";
import { useGetLeaderboard } from "@/services/leaderboard/hooks";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const Leaderboard = () => {
  const { data, isFetching, isError } = useGetLeaderboard({ mode: "daily" });

  useEffect(() => {
    console.log("Leaderboard data:", data);
    console.log("isFetching:", isFetching);
    console.log("isError:", isError);
  }, [data, isFetching, isError]);

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <CustomText size={28}>Leaderboard</CustomText>
      </View>
    </SafeAreaWrapper>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
