import { CustomText } from "@/components/atoms/customText";
import LeaderboardListRow from "@/components/molecules/leaderboard/leaderboardListRow";
import LeaderboardPodium from "@/components/molecules/leaderboard/leaderboardPodium";
import { LeaderboardRow } from "@/services/leaderboard/types";
import { useTheme } from "@/utils/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, View } from "react-native";

const RowSeparator = () => <View style={{ height: 8 }} />;

type Props = {
  rows: LeaderboardRow[];
  currentUserId?: string;
  isFetching: boolean;
  isError: boolean;
};

const LeaderboardList = ({ rows, currentUserId, isFetching, isError }: Props) => {
  const theme = useTheme();

  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.spinner} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
        <Ionicons name="cloud-offline-outline" size={40} color={theme.gray} />
        <CustomText size={15} color={theme.gray}>
          Failed to load leaderboard
        </CustomText>
      </View>
    );
  }

  if (rows.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
        <Ionicons name="people-outline" size={44} color={theme.gray} />
        <CustomText size={15} color={theme.gray}>
          No data yet
        </CustomText>
      </View>
    );
  }

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <FlashList
      data={rest}
      renderItem={({ item }) => (
        <LeaderboardListRow item={item} isMe={item.userId === currentUserId} />
      )}
      keyExtractor={(item) => item.userId}
      ItemSeparatorComponent={RowSeparator}
      ListHeaderComponent={
        top3.length > 0 ? (
          <LeaderboardPodium top3={top3} currentUserId={currentUserId} />
        ) : null
      }
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default LeaderboardList;
