import { CustomText } from "@/components/atoms/customText";
import LeaderboardAvatar from "@/components/atoms/leaderboardAvatar";
import { LeaderboardRow } from "@/services/leaderboard/types";
import { useTheme } from "@/utils/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"] as const;

type Props = {
  item: LeaderboardRow;
  isMe: boolean;
};

const LeaderboardListRow = ({ item, isMe }: Props) => {
  const theme = useTheme();
  const { rank, userName, score } = item;
  const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : undefined;

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isMe ? "rgba(108,99,255,0.12)" : theme.inputBackground,
          borderColor: isMe ? "#6C63FF" : theme.border,
        },
      ]}
    >
      <View style={styles.rankCell}>
        {medalColor ? (
          <Ionicons name="trophy" size={18} color={medalColor} />
        ) : (
          <CustomText size={14} color={theme.gray}>
            {rank}
          </CustomText>
        )}
      </View>

      <LeaderboardAvatar name={userName} size={40} isMe={isMe} />

      <View style={styles.nameCell}>
        <CustomText size={15} align="left" color={isMe ? "#6C63FF" : theme.text}>
          {isMe ? "You" : userName}
        </CustomText>
        <CustomText size={12} align="left" color={theme.gray}>
          @{userName}
        </CustomText>
      </View>

      <CustomText size={15} color={isMe ? "#6C63FF" : theme.text}>
        {score} pts
      </CustomText>
    </View>
  );
};

export default LeaderboardListRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  rankCell: {
    width: 28,
    alignItems: "center",
  },
  nameCell: {
    flex: 1,
    gap: 2,
  },
});
