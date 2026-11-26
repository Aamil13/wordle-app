import { CustomText } from "@/components/atoms/customText";
import LeaderboardAvatar from "@/components/atoms/leaderboardAvatar";
import { LeaderboardRow } from "@/services/leaderboard/types";
import { useTheme } from "@/utils/useTheme";
import { StyleSheet, View } from "react-native";

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"] as const;
const PODIUM_HEIGHTS = [80, 60, 50] as const; // 1st, 2nd, 3rd

type Props = {
  top3: LeaderboardRow[];
  currentUserId?: string;
};

const LeaderboardPodium = ({ top3, currentUserId }: Props) => {
  const theme = useTheme();

  // Render order: 2nd | 1st | 3rd
  const displayOrder = [top3[1], top3[0], top3[2]].filter(
    (p): p is LeaderboardRow => Boolean(p)
  );

  return (
    <View style={styles.wrapper}>
      {displayOrder.map((player) => {
        const { rank, userId, userName, score } = player;
        const isFirst = rank === 1;
        const podiumH = PODIUM_HEIGHTS[rank - 1] ?? 50;
        const medalColor = MEDAL_COLORS[rank - 1];
        const isMe = userId === currentUserId;

        return (
          <View key={userId} style={styles.column}>
            {isFirst && (
              <CustomText size={22} style={styles.crown}>
                👑
              </CustomText>
            )}

            <LeaderboardAvatar
              name={userName}
              size={isFirst ? 62 : 52}
              borderColor={medalColor}
              isMe={isMe}
            />

            <CustomText
              size={12}
              color={isMe ? "#6C63FF" : theme.text}
              style={styles.name}
            >
              {isMe ? "You" : `@${userName}`}
            </CustomText>

            <CustomText size={11} color={theme.gray} style={styles.score}>
              {score} pts
            </CustomText>

            <View
              style={[
                styles.block,
                { height: podiumH, backgroundColor: medalColor },
              ]}
            >
              <CustomText size={isFirst ? 28 : 22} color="#fff">
                {rank}
              </CustomText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default LeaderboardPodium;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 10,
  },
  column: {
    alignItems: "center",
    flex: 1,
  },
  crown: {
    marginBottom: 2,
  },
  name: {
    marginTop: 6,
    marginBottom: 2,
  },
  score: {
    marginBottom: 4,
  },
  block: {
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
