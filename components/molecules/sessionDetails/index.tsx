import { CustomText } from "@/components/atoms/customText";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const detailsData = ["Played", "Wins", "Winning Streak"];
const SessionDetails = ({ stats, isPending }: { stats?: unknown; isPending: boolean }) => {
  const statsData = stats as { stats?: { gamesPlayed: number; gamesWon: number; currentStreak: number } } | undefined;
  
  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {detailsData.map((item, index) => (
        <View style={styles.block} key={item}>
          <CustomText>{item}</CustomText>
          <CustomText>
            {index === 0 ? statsData?.stats?.gamesPlayed ?? 0 : index === 1 ? statsData?.stats?.gamesWon ?? 0 : statsData?.stats?.currentStreak ?? 0}
          </CustomText>
        </View>
      ))}
    </View>
  );
};

export default SessionDetails;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 12,
    paddingVertical: 12,
    width: "70%",
  },
  block: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
