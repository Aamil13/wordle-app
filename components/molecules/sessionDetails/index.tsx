import { CustomText } from "@/components/atoms/customText";
import { StyleSheet, View } from "react-native";

const detailsData = ["Played", "Wins", "Winning Streak"];
const SessionDetails = () => {
  return (
    <View style={styles.container}>
      {detailsData.map((item) => (
        <View style={styles.block} key={item}>
          <CustomText>{item}</CustomText>
          <CustomText>1</CustomText>
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
